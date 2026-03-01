"use client"

import Script from "next/script";
import { useId, useEffect, useState } from "react";

// Extend Window interface for the features.vote widget
declare global {
  interface Window {
    loadVotingBoard: (containerId: string) => void;
  }
}

const TARGET_CONTAINER_ID = "feature-requests-component";

const FeatureRequestsComponent = () => {
  const sessionKey = useId();
  const [config, setConfig] = useState<{ apiKey: string; slug: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the features API configuration
    fetch('/api/features-config')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setConfig(data);
        }
      })
      .catch(err => {
        setError('Failed to load configuration');
        console.error('Failed to fetch features config:', err);
      });
  }, []);

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Error: {error}</p>
        <p className="text-sm mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="text-center text-gray-500 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
        </div>
        <p className="mt-4 text-sm">Loading feature requests...</p>
      </div>
    );
  }

  return (
    <>
      <Script
        key={sessionKey}
        src={`https://features.vote/widget/widget.js?sessionKey=${sessionKey}`}
        onLoad={() => {
          // @ts-ignore
          window.loadVotingBoard(TARGET_CONTAINER_ID);
        }}
        // @ts-ignore
        color_mode="light"
        user_id="<Optional>"
        user_email="<Optional>"
        user_name="<Optional>"
        img_url="<Optional>"
        slug={config.slug}
        user_spend={0}
      />

      <div id={TARGET_CONTAINER_ID}></div>
    </>
  );
}

export default function FeatureRequestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Feature Request</h1>
          <p className="text-gray-600 mb-4">
            Let us know what you would like to see in the app!
          </p>
          {/* <div className="flex items-center gap-4">
            <a 
              href="https://prepsy.features.vote/roadmap" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Public Roadmap
            </a>
          </div> */}
        </div>

        {/* Feature Requests Widget */}
        <div>
          <FeatureRequestsComponent />
        </div>
      </div>
    </div>
  )
}