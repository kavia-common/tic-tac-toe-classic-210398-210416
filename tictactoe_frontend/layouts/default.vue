<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white/90 backdrop-blur border-b border-gray-100">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-8 w-8 rounded-lg" :style="{ backgroundColor: '#2563EB' }"></div>
          <h1 class="text-lg font-semibold text-gray-800">Tic-Tac-Toe</h1>
          <span class="badge badge-success">Ocean Professional</span>
        </div>
        <div class="text-xs text-gray-500">Nuxt 3 • No backend • Demo</div>
      </div>
    </header>
    <main class="flex-1">
      <div class="max-w-5xl mx-auto p-4">
        <slot />
      </div>
    </main>
    <footer class="py-4 text-center text-xs text-gray-400">
      Built with Nuxt 3. Session data only.
    </footer>
  </div>
</template>
