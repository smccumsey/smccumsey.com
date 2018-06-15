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
    <!-- <ul class="users">
      <li v-for="(user, index) in users" :key="index" class="user">
        <nuxt-link :to="{ name: 'id', params: { id: index }}">
          {{ user.name }}
        </nuxt-link>
      </li>
    </ul> -->
  </article>
  <div class="projects">
    <h2>Projects</h2>
    <ul>
      <li><router-link to="/dataviz">Map of Crimes in Boulder, CO <i>(June 2018)</i></router-link></li>
    </ul>
  </div>
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
.container {
  margin: 0 auto;
  width: 60%;
}
.g-signin2 {
  margin: 0 auto;
}
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

.projects {
  border-top: 1px solid #da6;
  border-left: 1px solid #da6;
  text-align: left;
  margin-top: 20px;
  padding: 5px;
  padding-left: 25px;
  font-weight: 200;
  color: #dA6;
}

.projects h2 {
  font-size: 16pt;
  font-weight: bold;
}

.projects ul {
  list-style-type: circle;
}
.projects a {
  text-decoration: underline;
}
</style>
