"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronLeft, Bookmark } from "lucide-react"
import BetaGate from "@/components/Dashboard/BetaGate"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"

// Course data mapping based on AP Precalculus Course and Exam Description
const courseData = {
  precalculus: {
    name: "AP Precalculus",
    topics: {
      "1": { 
        title: "Unit 1: Polynomial and Rational Functions", 
        description: "Equivalent expressions, rates of change, and composition of polynomial and rational functions",
        youtubeUrl: "https://www.youtube.com/watch?v=82pUuLgGtJo&list=PLwZ7hsYXWkb5JkVNBveNKYGlu-cckDkcX&index=45&t=372s",
        embedId: "82pUuLgGtJo?start=372"
      },
      "2": { 
        title: "Unit 2: Exponential and Logarithmic Functions", 
        description: "Equivalent expressions, rates of change, and composition of exponential and logarithmic functions",
        youtubeUrl: "https://www.youtube.com/watch?v=2aQR3ihj59M&list=PLwZ7hsYXWkb5JkVNBveNKYGlu-cckDkcX&index=47",
        embedId: "2aQR3ihj59M"
      },
      "3": { 
        title: "Unit 3: Trigonometric and Polar Functions", 
        description: "Periodic phenomena, trigonometric functions, identities, and polar coordinate system",
        youtubeUrl: "https://www.youtube.com/watch?v=ekO-vaPXgvI&list=PLwZ7hsYXWkb5JkVNBveNKYGlu-cckDkcX&index=48",
        embedId: "ekO-vaPXgvI"
      },
      "4": { 
        title: "Unit 4: Functions Involving Parameters, Vectors, and Matrices", 
        description: "Parametric functions, vector operations, and matrix transformations",
        youtubeUrl: "https://www.youtube.com/playlist?list=PLwZ7hsYXWkb5JkVNBveNKYGlu-cckDkcX",
        embedId: "PLwZ7hsYXWkb5JkVNBveNKYGlu-cckDkcX"
      }
    }
  }
}

export default function CoursePage() {
  const params = useParams()
  const router = useRouter()
  const subject = params.subject as string
  const topicId = params.topicId as string
  
  const [isCompleted, setIsCompleted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createSupabaseBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: userData } = await supabase
            .from('users')
            .select('admin')
            .eq('uid', user.id)
            .single()
          
          setIsAdmin((userData as any)?.admin === true)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])
  
  const currentSubject = courseData[subject as keyof typeof courseData]
  const currentTopic = currentSubject?.topics[topicId as keyof typeof currentSubject.topics]

  // Get unit-specific content based on AP Precalculus Course and Exam Description
  const getUnitContent = (unitId: string) => {
    switch (unitId) {
      case "1":
        return {
          introduction: "This unit covers polynomial and rational functions - two of the most important function families in mathematics. You'll learn how to analyze their behavior, understand their rates of change, and solve real-world problems using these powerful tools. By the end of this unit, you'll be able to predict how these functions behave without even graphing them.",
          prerequisites: [
            "Factoring polynomials (including difference of squares, trinomials, and grouping)",
            "Solving quadratic equations using multiple methods (factoring, quadratic formula, completing the square)",
            "Understanding function notation f(x) and evaluating functions at specific values",
            "Basic graphing skills including identifying intercepts and understanding domain/range"
          ],
          topics: [
            {
              title: "Understanding Average Rate of Change",
              content: "The average rate of change tells us how fast a function is changing between two points. Think of it like calculating your average speed on a road trip - you're finding the overall change divided by the time it took.",
              keyPoints: [
                "Formula: Average rate of change = [f(b) - f(a)] / (b - a)",
                "This represents the slope of the secant line between two points",
                "For a linear function, the average rate of change is constant everywhere",
                "For non-linear functions, the average rate of change varies between different intervals",
                "Example: If f(x) = x², the average rate of change from x = 1 to x = 3 is [f(3) - f(1)] / (3 - 1) = [9 - 1] / 2 = 4"
              ]
            },
            {
              title: "How Polynomial Functions Change",
              content: "Polynomial functions have predictable patterns in how they increase and decrease. Understanding these patterns helps you sketch graphs and solve optimization problems without a calculator.",
              keyPoints: [
                "A polynomial of degree n can have at most (n-1) turning points",
                "Between any two consecutive zeros, a polynomial doesn't change from increasing to decreasing (or vice versa)",
                "The degree tells you the maximum number of 'hills and valleys' the graph can have",
                "Example: f(x) = x³ - 3x has degree 3, so it can have at most 2 turning points",
                "Higher degree polynomials can have more complex behavior, but they follow predictable rules"
              ]
            },
            {
              title: "End Behavior of Polynomials",
              content: "The end behavior describes what happens to a polynomial as x approaches positive or negative infinity. This is determined entirely by the leading term (the term with the highest power).",
              keyPoints: [
                "For even degree polynomials: both ends go in the same direction",
                "For odd degree polynomials: the ends go in opposite directions",
                "Positive leading coefficient: right end goes up",
                "Negative leading coefficient: right end goes down",
                "Example: f(x) = -2x⁴ + 3x² - 1 has even degree and negative leading coefficient, so both ends go down",
                "The leading term dominates all other terms as |x| gets very large"
              ]
            },
            {
              title: "Zeros and Their Multiplicities",
              content: "Zeros are where the function equals zero (x-intercepts). The multiplicity tells us how the graph behaves at each zero - whether it crosses the x-axis or just touches it.",
              keyPoints: [
                "If (x - a) appears once as a factor, the zero has multiplicity 1 and the graph crosses the x-axis",
                "If (x - a)² appears as a factor, the zero has multiplicity 2 and the graph touches but doesn't cross",
                "Odd multiplicities: graph crosses the x-axis",
                "Even multiplicities: graph touches the x-axis but doesn't cross",
                "Example: f(x) = (x - 2)²(x + 1) has zeros at x = 2 (multiplicity 2) and x = -1 (multiplicity 1)"
              ]
            },
            {
              title: "Complex Zeros and the Fundamental Theorem",
              content: "Every polynomial of degree n has exactly n zeros when you count multiplicities and include complex numbers. This powerful theorem helps us understand the complete structure of polynomials.",
              keyPoints: [
                "Complex zeros always come in conjugate pairs for polynomials with real coefficients",
                "If a + bi is a zero, then a - bi is also a zero",
                "A degree 3 polynomial has exactly 3 zeros (counting multiplicities)",
                "Some zeros might be real, others might be complex",
                "Example: f(x) = x³ - 2x² + 4x - 8 has zeros at x = 2, x = 2i, and x = -2i"
              ]
            },
            {
              title: "Rational Functions and Asymptotes",
              content: "Rational functions are fractions where both the numerator and denominator are polynomials. They have unique features like asymptotes - lines that the graph approaches but never touches.",
              keyPoints: [
                "Vertical asymptotes occur where the denominator equals zero (and numerator doesn't)",
                "Horizontal asymptotes depend on the degrees of numerator and denominator",
                "If degree of numerator < degree of denominator: horizontal asymptote at y = 0",
                "If degrees are equal: horizontal asymptote at y = (leading coefficient of numerator)/(leading coefficient of denominator)",
                "If degree of numerator > degree of denominator: no horizontal asymptote (but there might be an oblique asymptote)"
              ]
            },
            {
              title: "Finding Zeros of Rational Functions",
              content: "A rational function equals zero only when its numerator equals zero (and the denominator doesn't equal zero at that same point). This simple rule helps you find all the zeros quickly.",
              keyPoints: [
                "Set the numerator equal to zero and solve",
                "Check that the denominator is not zero at those same x-values",
                "If both numerator and denominator are zero at the same x-value, you have a hole, not a zero",
                "Example: For f(x) = (x² - 4)/(x - 1), set x² - 4 = 0 to get x = ±2",
                "Both x = 2 and x = -2 are zeros since the denominator x - 1 ≠ 0 at these points"
              ]
            }
          ],
          practiceProblems: [
            "Find the average rate of change of f(x) = x³ - 2x from x = 0 to x = 2. Show your work step by step.",
            "For g(x) = -x⁴ + 2x³ + x² - 3, describe the end behavior and explain your reasoning.",
            "Find all zeros of h(x) = x³ - 7x + 6 and determine the multiplicity of each zero.",
            "For the rational function r(x) = (x² - 9)/(x² - 2x - 3), find all zeros, vertical asymptotes, and horizontal asymptotes.",
            "A polynomial function has zeros at x = -2 (multiplicity 2), x = 1 (multiplicity 1), and x = 3 (multiplicity 1). Write a possible equation for this polynomial."
          ]
        }
      case "2":
        return {
          introduction: "This unit covers exponential and logarithmic functions - the mathematical tools that describe growth, decay, and scaling in the real world. From compound interest to population growth to radioactive decay, these functions are everywhere. You'll learn to recognize exponential patterns, work with logarithms, and solve problems involving these powerful function families.",
          prerequisites: [
            "Properties of exponents (including negative and fractional exponents)",
            "Understanding of inverse functions and how to find them",
            "Solving equations using algebraic techniques",
            "Basic understanding of what logarithms represent (the inverse of exponentiation)"
          ],
          topics: [
            {
              title: "Exponential vs. Linear Growth",
              content: "The key difference between exponential and linear functions is how they change. Linear functions add the same amount each step, while exponential functions multiply by the same amount each step. This difference creates dramatically different growth patterns.",
              keyPoints: [
                "Linear growth: f(x) = mx + b adds the same amount (m) for each unit increase in x",
                "Exponential growth: f(x) = a·bˣ multiplies by the same factor (b) for each unit increase in x",
                "Example: $100 growing at $10 per year (linear) vs. $100 growing at 10% per year (exponential)",
                "After 10 years: Linear gives $200, exponential gives $259.37",
                "The exponential function eventually dominates any linear function"
              ]
            },
            {
              title: "Understanding Exponential Functions",
              content: "An exponential function has the form f(x) = a·bˣ where 'a' is the initial value and 'b' is the base (growth/decay factor). The base determines whether you have growth or decay.",
              keyPoints: [
                "Standard form: f(x) = a·bˣ where a ≠ 0, b > 0, and b ≠ 1",
                "If b > 1: exponential growth (function increases)",
                "If 0 < b < 1: exponential decay (function decreases)",
                "The value 'a' is the y-intercept (what happens when x = 0)",
                "Example: f(x) = 3·2ˣ starts at 3 and doubles every time x increases by 1"
              ]
            },
            {
              title: "Properties of Exponents in Functions",
              content: "The same exponent rules you learned in algebra apply to exponential functions. These properties help you simplify expressions and solve equations involving exponential functions.",
              keyPoints: [
                "Product rule: bˣ · bʸ = bˣ⁺ʸ",
                "Quotient rule: bˣ / bʸ = bˣ⁻ʸ",
                "Power rule: (bˣ)ʸ = bˣʸ",
                "Zero exponent: b⁰ = 1 (for any b ≠ 0)",
                "Negative exponent: b⁻ˣ = 1/bˣ",
                "Example: 2³ · 2⁵ = 2⁸ = 256"
              ]
            },
            {
              title: "Exponential Rate of Change",
              content: "Exponential functions have a unique property: their rate of change is proportional to their current value. This means the faster they're growing, the faster they grow even more.",
              keyPoints: [
                "The rate of change of an exponential function is proportional to the function's value",
                "This creates the characteristic 'J-curve' shape of exponential growth",
                "For f(x) = bˣ, the rate of change increases as the function value increases",
                "This is why exponential growth starts slowly but then explodes",
                "Real example: viral spread, where more infected people lead to even faster infection rates"
              ]
            },
            {
              title: "What Are Logarithms?",
              content: "A logarithm answers the question: 'To what power must I raise the base to get this number?' Logarithms are the inverse operation of exponentiation, just like division is the inverse of multiplication.",
              keyPoints: [
                "Definition: log_b(x) = y means bʸ = x",
                "The logarithm is the exponent you need",
                "Example: log₂(8) = 3 because 2³ = 8",
                "Common logarithm: log₁₀(x) or just log(x)",
                "Natural logarithm: log_e(x) or ln(x), where e ≈ 2.718"
              ]
            },
            {
              title: "Properties of Logarithms",
              content: "Logarithms have special properties that make them incredibly useful for solving exponential equations and simplifying complex expressions. These properties mirror the properties of exponents.",
              keyPoints: [
                "Product rule: log_b(xy) = log_b(x) + log_b(y)",
                "Quotient rule: log_b(x/y) = log_b(x) - log_b(y)",
                "Power rule: log_b(xⁿ) = n·log_b(x)",
                "Change of base: log_b(x) = log(x)/log(b)",
                "Example: log₂(8x) = log₂(8) + log₂(x) = 3 + log₂(x)"
              ]
            },
            {
              title: "Logarithmic Functions and Their Graphs",
              content: "Logarithmic functions are the inverse of exponential functions. Their graphs are reflections of exponential graphs across the line y = x, and they have some unique characteristics.",
              keyPoints: [
                "Domain: x > 0 (you can't take the log of zero or negative numbers)",
                "Range: all real numbers",
                "Vertical asymptote at x = 0",
                "Passes through (1, 0) because log_b(1) = 0 for any base b",
                "Increasing function if b > 1, decreasing if 0 < b < 1"
              ]
            },
            {
              title: "The Special Number e and Natural Logarithms",
              content: "The number e (approximately 2.718) is one of the most important constants in mathematics. It appears naturally in many growth and decay processes, making eˣ and ln(x) especially important.",
              keyPoints: [
                "e ≈ 2.71828... (it's an irrational number like π)",
                "eˣ is the exponential function that equals its own rate of change",
                "ln(x) is the natural logarithm (logarithm base e)",
                "Many real-world processes naturally involve e",
                "Example: continuous compound interest uses the formula A = Pe^(rt)"
              ]
            }
          ],
          practiceProblems: [
            "If a bacteria culture starts with 200 bacteria and doubles every 3 hours, write an exponential function and find the population after 12 hours.",
            "Solve for x: 3^(x+1) = 27. Show your work using properties of exponents.",
            "Use logarithm properties to expand: ln(x²y/z³)",
            "If ln(a) = 2 and ln(b) = 3, find the value of ln(a²b/√e).",
            "A radioactive substance decays according to A(t) = 100e^(-0.05t). When will only 25% of the original amount remain?"
          ]
        }
      case "3":
        return {
          introduction: "This unit explores trigonometric and polar functions - the mathematics of cycles, waves, and rotation. From the motion of a Ferris wheel to the sound waves from your speakers, trigonometry describes the world of periodic phenomena. You'll master the unit circle, understand how sine and cosine create waves, and discover a completely new coordinate system using polar coordinates.",
          prerequisites: [
            "Right triangle trigonometry (SOH-CAH-TOA)",
            "Understanding of radians and degrees, and how to convert between them",
            "Basic knowledge of the unit circle and special angle values",
            "Understanding of function transformations (shifts, stretches, reflections)"
          ],
          topics: [
            {
              title: "Recognizing Periodic Patterns",
              content: "Periodic functions repeat their values in regular intervals. Understanding periodicity is key to modeling everything from tides to heartbeats to seasonal temperature changes.",
              keyPoints: [
                "Period: the length of one complete cycle",
                "Amplitude: the maximum distance from the midline",
                "Midline: the horizontal line around which the function oscillates",
                "Example: A Ferris wheel completes one rotation (period) every 10 minutes",
                "The height varies from 5 feet to 45 feet, so amplitude = 20 feet and midline = 25 feet"
              ]
            },
            {
              title: "The Unit Circle and Trigonometric Functions",
              content: "The unit circle is a circle with radius 1 centered at the origin. It's the foundation for understanding sine and cosine beyond right triangles, extending these functions to all real numbers.",
              keyPoints: [
                "On the unit circle, cos(θ) is the x-coordinate and sin(θ) is the y-coordinate",
                "This works for any angle θ, not just acute angles",
                "Key angles: 0°, 30°, 45°, 60°, 90° (and their radian equivalents)",
                "sin²(θ) + cos²(θ) = 1 for any angle (Pythagorean identity)",
                "Example: At θ = 60°, the point is (1/2, √3/2), so cos(60°) = 1/2 and sin(60°) = √3/2"
              ]
            },
            {
              title: "Graphs of Sine and Cosine",
              content: "The graphs of sine and cosine are smooth, continuous waves that repeat every 2π radians (360°). Understanding their basic shape helps you work with more complex trigonometric functions.",
              keyPoints: [
                "Both sin(x) and cos(x) have period 2π and amplitude 1",
                "sin(x) starts at (0,0) and increases, cos(x) starts at (0,1) and decreases",
                "cos(x) is just sin(x) shifted left by π/2 units",
                "Domain: all real numbers; Range: [-1, 1]",
                "Key points for sin(x): (0,0), (π/2,1), (π,0), (3π/2,-1), (2π,0)"
              ]
            },
            {
              title: "Transformations of Sinusoidal Functions",
              content: "The general form f(x) = A sin(B(x - C)) + D allows you to model any sinusoidal pattern by adjusting amplitude, period, phase shift, and vertical shift.",
              keyPoints: [
                "A controls amplitude: |A| is the maximum distance from midline",
                "B controls period: period = 2π/|B|",
                "C controls phase shift: positive C shifts right, negative C shifts left",
                "D controls vertical shift: moves the midline up or down",
                "Example: f(x) = 3sin(2(x - π/4)) + 1 has amplitude 3, period π, phase shift π/4 right, midline at y = 1"
              ]
            },
            {
              title: "The Tangent Function",
              content: "The tangent function, defined as tan(x) = sin(x)/cos(x), has a very different graph from sine and cosine. It has vertical asymptotes and a period of π instead of 2π.",
              keyPoints: [
                "tan(x) = sin(x)/cos(x), so it's undefined when cos(x) = 0",
                "Vertical asymptotes at x = π/2 + nπ (where n is any integer)",
                "Period is π (not 2π like sine and cosine)",
                "Range: all real numbers (unlike sine and cosine which are bounded)",
                "tan(x) represents the slope of the line from origin to point (cos(x), sin(x))"
              ]
            },
            {
              title: "Modeling Real-World Periodic Phenomena",
              content: "Trigonometric functions are perfect for modeling anything that repeats in cycles. The key is identifying the period, amplitude, and any shifts from real-world data.",
              keyPoints: [
                "Identify the period (how long one complete cycle takes)",
                "Find the amplitude (half the distance between maximum and minimum values)",
                "Determine the midline (average of maximum and minimum values)",
                "Look for phase shifts (horizontal displacement from standard position)",
                "Example: Daily temperature might be T(t) = 15sin(π(t-6)/12) + 70, where t is hours after midnight"
              ]
            },
            {
              title: "Inverse Trigonometric Functions",
              content: "Inverse trig functions (arcsin, arccos, arctan) help you find angles when you know the trigonometric ratio. They're essential for solving trigonometric equations.",
              keyPoints: [
                "arcsin(x) asks: 'what angle has sine equal to x?'",
                "Domain restrictions ensure these functions are actually functions (pass vertical line test)",
                "arcsin: domain [-1,1], range [-π/2, π/2]",
                "arccos: domain [-1,1], range [0, π]",
                "arctan: domain (-∞,∞), range (-π/2, π/2)"
              ]
            },
            {
              title: "Essential Trigonometric Identities",
              content: "Trigonometric identities are equations that are true for all valid values of the variable. They're tools for simplifying expressions and solving equations.",
              keyPoints: [
                "Pythagorean identity: sin²(x) + cos²(x) = 1",
                "Reciprocal identities: csc(x) = 1/sin(x), sec(x) = 1/cos(x), cot(x) = 1/tan(x)",
                "Even/odd identities: cos(-x) = cos(x), sin(-x) = -sin(x)",
                "Sum formulas: sin(A + B) = sin(A)cos(B) + cos(A)sin(B)",
                "Double angle: sin(2x) = 2sin(x)cos(x), cos(2x) = cos²(x) - sin²(x)"
              ]
            },
            {
              title: "Introduction to Polar Coordinates",
              content: "Polar coordinates describe a point's location using distance from the origin (r) and angle from the positive x-axis (θ). This system is natural for describing circular and rotational motion.",
              keyPoints: [
                "Point notation: (r, θ) where r is distance and θ is angle",
                "Conversion to rectangular: x = r cos(θ), y = r sin(θ)",
                "Conversion from rectangular: r = √(x² + y²), θ = arctan(y/x)",
                "Same point can have multiple representations: (r, θ) = (r, θ + 2πn) = (-r, θ + π)",
                "Example: Point (3, π/4) is 3 units from origin at 45° angle"
              ]
            },
            {
              title: "Polar Functions and Their Graphs",
              content: "Polar functions express r as a function of θ, creating beautiful curves that are difficult to describe in rectangular coordinates. These include circles, roses, cardioids, and spirals.",
              keyPoints: [
                "Circle: r = a creates a circle centered at origin with radius a",
                "Cardioid: r = a(1 + cos(θ)) creates a heart-shaped curve",
                "Rose curves: r = a cos(nθ) creates n petals if n is odd, 2n petals if n is even",
                "Spiral: r = aθ creates an Archimedean spiral",
                "To graph, make a table of θ and r values, then plot points"
              ]
            }
          ],
          practiceProblems: [
            "A point on the unit circle has coordinates (√2/2, √2/2). Find the angle θ in both degrees and radians.",
            "Write a sinusoidal function for a Ferris wheel with diameter 80 feet, center 50 feet above ground, completing one rotation every 8 minutes.",
            "Solve for all solutions in [0, 2π]: 2sin(x) - √3 = 0",
            "Convert the rectangular point (-3, 3) to polar coordinates.",
            "Identify the type of polar curve and sketch: r = 4cos(3θ)"
          ]
        }
      case "4":
        return {
          introduction: "This unit introduces three powerful mathematical concepts: parametric functions, vectors, and matrices. These tools allow you to describe motion in the plane, work with quantities that have both magnitude and direction, and perform geometric transformations. You'll see how mathematics can model everything from projectile motion to computer graphics transformations.",
          prerequisites: [
            "Understanding of function notation and graphing techniques",
            "Knowledge of trigonometry and the unit circle",
            "Familiarity with coordinate geometry and distance formulas",
            "Basic understanding of systems of equations and their solutions"
          ],
          topics: [
            {
              title: "What Are Parametric Functions?",
              content: "Instead of expressing y as a function of x, parametric functions express both x and y as functions of a third variable called a parameter (usually t for time). This allows you to describe curves that would be impossible to represent as regular functions.",
              keyPoints: [
                "Parametric form: x = f(t), y = g(t) where t is the parameter",
                "The parameter often represents time, but it can be any variable",
                "Parametric curves can loop back on themselves (unlike regular functions)",
                "Example: x = cos(t), y = sin(t) traces out a circle as t goes from 0 to 2π",
                "You can think of parametric equations as giving directions: 'at time t, go to position (f(t), g(t))'"
              ]
            },
            {
              title: "Motion and Parametric Functions",
              content: "Parametric functions are perfect for describing motion because they naturally incorporate time. You can analyze how fast an object is moving and in what direction at any moment.",
              keyPoints: [
                "Position at time t: (x(t), y(t))",
                "Velocity components: dx/dt (horizontal speed) and dy/dt (vertical speed)",
                "Speed is the magnitude of velocity: √[(dx/dt)² + (dy/dt)²]",
                "Direction of motion is given by the angle of the velocity vector",
                "Example: For a projectile, x(t) = v₀cos(θ)t and y(t) = v₀sin(θ)t - ½gt²"
              ]
            },
            {
              title: "Modeling Projectile Motion",
              content: "When you throw a ball, shoot an arrow, or launch a rocket, the path follows predictable parametric equations. Understanding these equations helps you predict where the projectile will land.",
              keyPoints: [
                "Horizontal motion: x(t) = x₀ + v₀cos(θ)t (constant velocity, no acceleration)",
                "Vertical motion: y(t) = y₀ + v₀sin(θ)t - ½gt² (constant acceleration due to gravity)",
                "v₀ is initial speed, θ is launch angle, g ≈ 9.8 m/s² or 32 ft/s²",
                "Maximum height occurs when dy/dt = 0",
                "Range (horizontal distance) depends on both initial speed and launch angle"
              ]
            },
            {
              title: "Understanding Vectors",
              content: "A vector is a mathematical object that has both magnitude (size) and direction. Unlike regular numbers (scalars), vectors tell you not just 'how much' but also 'which way.'",
              keyPoints: [
                "Vector notation: v⃗ = ⟨a, b⟩ or v⃗ = ai⃗ + bj⃗",
                "Magnitude: |v⃗| = √(a² + b²)",
                "Direction: θ = arctan(b/a) (with appropriate quadrant adjustments)",
                "Vectors represent quantities like velocity, force, and displacement",
                "Example: Wind blowing northeast at 20 mph can be written as ⟨14.14, 14.14⟩"
              ]
            },
            {
              title: "Vector Operations",
              content: "You can add vectors, subtract them, and multiply them by numbers (scalars). These operations have clear geometric interpretations and practical applications.",
              keyPoints: [
                "Vector addition: ⟨a₁, b₁⟩ + ⟨a₂, b₂⟩ = ⟨a₁ + a₂, b₁ + b₂⟩",
                "Geometric interpretation: place vectors tip-to-tail",
                "Scalar multiplication: k⟨a, b⟩ = ⟨ka, kb⟩ (changes magnitude, preserves direction if k > 0)",
                "Unit vector: a vector with magnitude 1, shows pure direction",
                "Example: If you walk 3 miles east then 4 miles north, your displacement is ⟨3, 4⟩ with magnitude 5 miles"
              ]
            },
            {
              title: "Matrices as Transformation Tools",
              content: "A matrix can transform vectors by rotating, reflecting, or scaling them. This is the mathematical foundation behind computer graphics, robotics, and many other applications.",
              keyPoints: [
                "A 2×2 matrix [a b; c d] transforms vector ⟨x, y⟩ to ⟨ax + by, cx + dy⟩",
                "Rotation matrix: [cos(θ) -sin(θ); sin(θ) cos(θ)] rotates by angle θ",
                "Scaling matrix: [k 0; 0 k] scales by factor k",
                "Reflection matrices can flip across axes or other lines",
                "Example: [0 -1; 1 0] rotates any vector 90° counterclockwise"
              ]
            },
            {
              title: "Matrix Operations",
              content: "You can add matrices, multiply them by scalars, and multiply matrices together. Matrix multiplication allows you to combine transformations.",
              keyPoints: [
                "Matrix addition: add corresponding entries",
                "Scalar multiplication: multiply every entry by the scalar",
                "Matrix multiplication: row × column dot products",
                "Matrix multiplication is not commutative: AB ≠ BA in general",
                "Multiplying matrices combines their transformations: first apply B, then apply A to get AB"
              ]
            }
          ],
          practiceProblems: [
            "A particle moves according to x(t) = 2t - 1, y(t) = t² + 3. Find the particle's position and velocity at t = 2.",
            "Eliminate the parameter from x = 3cos(t), y = 3sin(t) to find a rectangular equation.",
            "A projectile is launched at 45° with initial speed 40 m/s. Write parametric equations and find when it hits the ground.",
            "Find the magnitude and direction of vector v⃗ = ⟨-6, 8⟩.",
            "Apply the transformation matrix [2 0; 0 3] to the vector ⟨4, -2⟩ and describe the geometric effect."
          ]
        }
      default:
        return {
          introduction: "This comprehensive review integrates all AP Precalculus concepts, helping students prepare for the AP exam and advanced mathematics courses.",
          topics: [],
          practiceProblems: []
        }
    }
  }

  const unitContent = getUnitContent(topicId)
  
  if (!currentSubject || !currentTopic) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h1>
          <button
            onClick={() => router.push('/dashboard/courses')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Return to courses
          </button>
        </div>
      </div>
    )
  }

  const allTopics = Object.entries(currentSubject.topics).map(([id, topic]) => ({
    id: parseInt(id),
    title: topic.title,
    active: id === topicId
  }))

  const handleTopicClick = (newTopicId: number) => {
    router.push(`/dashboard/courses/${subject}/${newTopicId}`)
  }

  const coursePageContent = (
    <div className="min-h-screen bg-white flex">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard/courses')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentTopic.title}</h1>
                <p className="text-gray-600 text-sm">{currentSubject.name}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bookmark className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Course Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Completion Status */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="completed" className="text-sm font-medium text-gray-700">
                    I understand this topic
                  </label>
                </div>
              </div>
            </div>

            {/* YouTube Video Embed */}
            <div className="mb-8">
              <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${currentTopic.embedId}`}
                    title={currentTopic.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                {unitContent.introduction}
              </p>
            </div>

            {/* Prerequisites */}
            {unitContent.prerequisites && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Prerequisites</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <p className="text-amber-800 mb-4 font-medium">
                    Students taking this unit are expected to have a foundational understanding of the following:
                  </p>
                  <ul className="space-y-2">
                    {unitContent.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-amber-900 text-sm">{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Detailed Topics */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Topics Covered</h2>
              <div className="space-y-6">
                {unitContent.topics.map((topic, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-3 text-lg">{topic.title}</h3>
                    <p className="text-gray-700 mb-4 leading-relaxed">{topic.content}</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Key Points:</h4>
                      <ul className="space-y-1">
                        {topic.keyPoints.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Problems */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Practice Problems</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 mb-4 font-medium">
                  Test your understanding with these AP-style practice problems:
                </p>
                <div className="space-y-4">
                  {unitContent.practiceProblems.map((problem, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-900 font-medium">{problem}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Study Tips */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Study Tips</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <ul className="space-y-3 text-green-800">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Watch the video lesson first to understand the concepts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Work through the practice problems to test your understanding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Take notes on key formulas and problem-solving strategies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Review previous units if you need to refresh foundational concepts</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Mark this unit as complete when you can solve similar problems confidently</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Navigation Sidebar */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Course Navigation</h3>
          <div className="text-sm text-gray-600 mb-3">{currentSubject.name}</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {allTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicClick(topic.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg text-sm transition-all duration-200",
                  topic.active
                    ? "bg-green-100 border border-green-200 text-green-800 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    topic.active
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}>
                    {topic.id}
                  </div>
                  <span className="flex-1">{topic.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return coursePageContent
}
