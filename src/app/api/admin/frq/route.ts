import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server-client'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('admin')
      .eq('uid', user.id)
      .single()

    if (userError || !userData?.admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const {
      subject,
      unit,
      topic,
      question,
      difficulty = 'Medium',
      time_limit = 25,
      exam_type = 'Practice',
      year,
      sample_response = '',
      stimulus_image_url = '',
      stimulus_image_description = '',
      stimulus_image_2_url = '',
      stimulus_image_2_description = '',
      frq_type = '',
      frq_specific_data = {},
      max_points = 0,
      parts = []
    } = body

    // Validate required fields
    if (!subject || !unit || !topic || !question || !frq_type) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, unit, topic, question, frq_type' },
        { status: 400 }
      )
    }

    if (!parts || parts.length === 0) {
      return NextResponse.json(
        { error: 'At least one question part is required' },
        { status: 400 }
      )
    }

    // Validate parts
    for (const part of parts) {
      if (!part.part_label || !part.part_question) {
        return NextResponse.json(
          { error: 'Each part must have a label and question' },
          { status: 400 }
        )
      }
    }

    // Start a transaction
    const { data: frqQuestion, error: frqError } = await supabase
      .from('frq_questions')
      .insert({
        subject,
        unit,
        topic,
        question,
        difficulty,
        total_points: 0, // Will be calculated by trigger
        time_limit,
        exam_type,
        year,
        sample_response,
        stimulus_image_url: stimulus_image_url || null,
        stimulus_image_description: stimulus_image_description || null,
        stimulus_image_2_url: stimulus_image_2_url || null,
        stimulus_image_2_description: stimulus_image_2_description || null,
        frq_type: frq_type || null,
        frq_specific_data: frq_specific_data || null,
        max_points: max_points || 0,
        created_by: user.id,
        is_active: true
      })
      .select()
      .single()

    if (frqError) {
      console.error('Error creating FRQ question:', frqError)
      return NextResponse.json(
        { error: 'Failed to create FRQ question' },
        { status: 500 }
      )
    }

    // Insert parts
    const partsToInsert = parts.map((part: any, index: number) => ({
      frq_question_id: frqQuestion.id,
      part_label: part.part_label,
      part_question: part.part_question,
      points: part.points || 1,
      hint: part.hint || '',
      sample_answer: part.sample_answer || '',
      order_index: part.order_index || index + 1
    }))

    const { error: partsError } = await supabase
      .from('frq_parts')
      .insert(partsToInsert)

    if (partsError) {
      console.error('Error creating FRQ parts:', partsError)
      
      // Clean up the question if parts failed
      await supabase
        .from('frq_questions')
        .delete()
        .eq('id', frqQuestion.id)

      return NextResponse.json(
        { error: 'Failed to create FRQ parts' },
        { status: 500 }
      )
    }

    // Get the complete FRQ with parts for response
    const { data: completeFRQ, error: fetchError } = await supabase
      .from('frq_questions_with_parts')
      .select('*')
      .eq('id', frqQuestion.id)
      .single()

    if (fetchError) {
      console.error('Error fetching complete FRQ:', fetchError)
    }

    return NextResponse.json({
      success: true,
      frq: completeFRQ || frqQuestion,
      message: 'FRQ question created successfully'
    })

  } catch (error) {
    console.error('Error in FRQ creation API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const unit = searchParams.get('unit')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('frq_questions_with_parts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (subject) {
      query = query.eq('subject', subject)
    }

    if (unit) {
      query = query.eq('unit', unit)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    const { data: frqs, error } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching FRQs:', error)
      return NextResponse.json(
        { error: 'Failed to fetch FRQ questions' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      frqs: frqs || [],
      count: frqs?.length || 0
    })

  } catch (error) {
    console.error('Error in FRQ fetch API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
