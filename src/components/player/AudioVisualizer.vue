<script setup lang="ts">
  import { useTheme } from '@/composables/useTheme'
  import { onMounted, onUnmounted, ref, watch } from 'vue'

  const props = defineProps<{
    radius?: number
  }>()

  const { theme } = useTheme()
  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let audioContext: AudioContext | null = null
  let analyser: AnalyserNode | null = null
  let source: MediaElementAudioSourceNode | null = null
  let animationId: number | null = null
  let strokeColor = '#d4a373'

  const updateColor = () => {
    const style = getComputedStyle(document.documentElement)
    strokeColor = style.getPropertyValue('--accent-primary').trim() || '#d4a373'
  }

  watch(theme, () => {
    setTimeout(updateColor, 100)
  })

  const resumeContext = async () => {
    if (audioContext && audioContext.state === 'suspended') {
      try {
        await audioContext.resume()
      } catch (error) {
        console.warn('Failed to resume audio context:', error)
      }
    }
  }

  const initAudio = async () => {
    const audio = document.getElementById('global-audio') as HTMLAudioElement
    if (!audio) return

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
        source = audioContext.createMediaElementSource(audio)
        source.connect(analyser)
        analyser.connect(audioContext.destination)
      } catch {}
    }

    await resumeContext()
  }

  const draw = () => {
    if (!canvasRef.value || !analyser) return

    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const render = () => {
      animationId = requestAnimationFrame(render)
      analyser!.getByteFrequencyData(dataArray)

      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2
      const radius = props.radius || Math.min(width, height) / 4

      ctx.clearRect(0, 0, width, height)

      const bars = 120
      const step = Math.floor(bufferLength / bars)

      for (let i = 0; i < bars; i++) {
        const value = dataArray[i * step] || 0
        const percent = value / 255
        const barHeight = radius * 0.5 * percent * 1.5
        const angle = (i / bars) * Math.PI * 2

        const x1 = centerX + Math.cos(angle) * radius
        const y1 = centerY + Math.sin(angle) * radius
        const x2 = centerX + Math.cos(angle) * (radius + barHeight)
        const y2 = centerY + Math.sin(angle) * (radius + barHeight)

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = strokeColor
        ctx.globalAlpha = 0.4 + percent * 0.6
        ctx.lineWidth = 4
        ctx.lineCap = 'round'
        ctx.stroke()
      }
      ctx.globalAlpha = 1.0
    }
    render()
  }

  const handleVisibilityChange = () => {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = null
      }
    } else {
      if (!animationId) draw()
    }
  }

  onMounted(() => {
    updateColor()
    initAudio()
    if (canvasRef.value) {
      canvasRef.value.width = canvasRef.value.offsetWidth
      canvasRef.value.height = canvasRef.value.offsetHeight
      draw()
    }

    window.addEventListener('resize', () => {
      if (canvasRef.value) {
        canvasRef.value.width = canvasRef.value.offsetWidth
        canvasRef.value.height = canvasRef.value.offsetHeight
      }
    })

    document.addEventListener('visibilitychange', handleVisibilityChange)

    const audio = document.getElementById('global-audio') as HTMLAudioElement
    if (audio) audio.addEventListener('play', resumeContext)
  })

  onUnmounted(() => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }

    document.removeEventListener('visibilitychange', handleVisibilityChange)

    const audio = document.getElementById('global-audio') as HTMLAudioElement
    if (audio) audio.removeEventListener('play', resumeContext)

    if (audioContext && audioContext.state !== 'closed') audioContext.close()
  })
</script>

<template>
  <canvas ref="canvasRef" class="audio-visualizer"></canvas>
</template>

<style scoped>
  .audio-visualizer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
  }
</style>
