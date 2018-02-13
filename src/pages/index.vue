<template>
<section class="container">
  <div class="home__logo">
    <img src="@/assets/img/mushspore_yellow.svg" alt="Personal Logo" class="logo__img" />
    <span class="logo__text">
      <h1 class="title">
              Stephanie McCumsey
            </h1>
    </span>
  </div>
  <article class="bio">
    <p>Welcome! I'm a software devloper working mostly on the front-end.</p>
    <p>Please check back on Feb 15 for a project demo.</p>
    <!-- <ul class="users">
      <li v-for="(user, index) in users" :key="index" class="user">
        <nuxt-link :to="{ name: 'id', params: { id: index }}">
          {{ user.name }}
        </nuxt-link>
      </li>
    </ul> -->
  </article>
</section>
</template>

<script>

export default {
  data() {
    return {};
  },
};
</script>

<style scoped>
.home__logo {
    position: relative;
    width: 100%;
    height: 300px;
}

.logo__img {
  width: 100%;
  height: auto;
  position: absolute;
  left: 0;
  /* max-width: 400px; */
  max-height: 289px;
}

.logo__text {
  position: absolute;
  width: 100%;
  top: 28%;
  left: 0;
}

.title {
  margin: 0 auto;
  max-width: 11ch;
  font-family: 'Jacques Francois Shadow', cursive;
}

.bio {
  font-family: 'Open Sans', sans-serif;
}

.users {
  list-style: none;
  margin: 0;
  padding: 0;
}

.user {
  margin: 10px 0;
}
</style>
