<template>
  <section class="h-screen overflow-hidden relative">
    <div class="h-screen bg-primary/70 flex flex-col items-center justify-center">
      <RouterView />
    </div>
    <img src="@/assets/login-bg.jpg" class="fixed top-0 right-0 bottom-0 left-0 -z-1">
  </section>
</template>
