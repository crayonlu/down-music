let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let source: MediaElementAudioSourceNode | null = null

export function useAudioVisualizer() {
  const initAudioContext = async (audioElement: HTMLAudioElement) => {
    if (!audioContext) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioContext = new AudioContextClass()
    }

    if (!analyser) {
      analyser = audioContext.createAnalyser()
      analyser.fftSize = 512
    }

    if (!source) {
      try {
        source = audioContext.createMediaElementSource(audioElement)
        source.connect(analyser)
        analyser.connect(audioContext.destination)
      } catch (error) {
        console.warn('MediaElementSource already created:', error)
      }
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    return analyser
  }

  const resumeContext = async () => {
    if (audioContext && audioContext.state === 'suspended') {
      try {
        await audioContext.resume()
      } catch (error) {
        console.warn('Failed to resume audio context:', error)
      }
    }
  }

  const getAnalyser = () => analyser

  return {
    initAudioContext,
    resumeContext,
    getAnalyser,
  }
}
