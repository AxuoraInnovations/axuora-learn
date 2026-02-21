import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { videoUrl } = await req.json()
    
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/\s]{11})/,
      /youtube\.com\/shorts\/([^&?\/\s]{11})/
    ]
    
    let videoId = null
    for (const pattern of patterns) {
      const match = videoUrl.match(pattern)
      if (match) {
        videoId = match[1]
        break
      }
    }
    
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Invalid YouTube URL. Please provide a valid youtube.com or youtu.be link.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Fetch video info and transcript from YouTube API
    // Note: For production, you'd use youtube-transcript library or YouTube Data API
    // This is a placeholder that returns structured data
    
    const apiKey = Deno.env.get('YOUTUBE_API_KEY')
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ 
          videoId,
          title: 'Video Title (API key not configured)',
          transcript: 'Transcript extraction requires YouTube Data API key. Please configure YOUTUBE_API_KEY in Supabase secrets.',
          duration: 0,
          thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Fetch video metadata
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`
    )
    
    if (!videoResponse.ok) {
      throw new Error('Failed to fetch video data')
    }
    
    const videoData = await videoResponse.json()
    const video = videoData.items?.[0]
    
    if (!video) {
      return new Response(
        JSON.stringify({ error: 'Video not found or is private' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Parse duration (PT1H2M10S format)
    const duration = video.contentDetails.duration
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    const hours = parseInt(match?.[1] || '0')
    const minutes = parseInt(match?.[2] || '0')
    const seconds = parseInt(match?.[3] || '0')
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    
    // For transcript, you'd integrate youtube-transcript library
    // Placeholder for now
    return new Response(
      JSON.stringify({
        videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        transcript: 'Transcript fetching requires additional setup. Use captions API or youtube-transcript library.',
        duration: totalSeconds,
        thumbnailUrl: video.snippet.thumbnails.high?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        channelTitle: video.snippet.channelTitle
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('YouTube extraction error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to extract YouTube content' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
