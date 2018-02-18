<template lang="html">
  <section class="create-form">
    <div class="create__item">
      <h3>Title</h3>
      <div class="item__subitem">
        <label>Event Title</label>
        <input type="text" name="" value="">
      </div>
    </div>
    <div class="create__item">
      <h3>Contact Information</h3>
      <div class="item__subitem">
        <label>Name</label>
        <input type="text" name="" value="">
      </div>
      <div class="item__subitem">
        <label>Phone</label>
        <masked-input
          type="text"
          name="phone"
          class="form-control"
          v-model="phone"
          :mask="['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]"
          :guide="false"
          placeholderChar="#">
        </masked-input>
      </div>
      <div class="item__subitem">
        <label>Email</label>
        <masked-input
          type="text"
          name="email"
          class="form-control"
          v-model="email"
          :mask="emailMask"
          :guide="false"
          placeholderChar="#">
        </masked-input>
      </div>
      <div class="item__subitem">
        <label>URL</label>
        <input type="text" name="" value="">
      </div>
    </div>
    <div class="create__item">
      <h3>Event Date Range</h3>
      <div class="item__subitem">
        <label>Start Date</label>
        <datepicker placeholder="Select Date" :value="startDate"></datepicker>
      </div>
      <div class="item__subitem">
        <label>End Date</label>
        <datepicker placeholder="Select Date" :value="endDate"></datepicker>
      </div>
    </div>
    <div class="create__item">
      <h3>Description</h3>
      <vue-editor v-model="description"></vue-editor>
    </div>
    <div class="create__item">
      <button class="submit-button" type="button" name="button" @click="submitEvent">Add Event</button>
    </div>
  </section>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import { VueEditor } from 'vue2-editor'
import MaskedInput from 'vue-text-mask'
import emailMask from 'text-mask-addons/dist/emailMask'

export default {
  components: {
    Datepicker,
    VueEditor,
    MaskedInput,
  },
  data() {
    return {
      title: null,
      startDate: null,
      endDate: null,
      description: null,
      phone: null,
      email: null,
      name: null,
      emailMask: emailMask,
    };
  },
  methods: {
    submitEvent() {
      return {
        startDate: this.startDate,
        endDate: this.endDate,
        name: this.name,
        phone: this.phone,
        email: this.email,
        title: this.title,
        description: this.description,
      }
    }
  }
}
</script>

<style lang="css">
.create-form {
  background: #fff;
  margin: 40px 10px;
  padding: 10px;
  display: grid;
  grid-row-gap: 20px;
}

.create__item {
  display: grid;
  grid-row-gap: 10px;
}

.item__subitem {
  display: grid;
  grid-template-columns: 1fr 5fr;
}

.submit-button {
  font-size: 15pt;
  cursor: pointer;
}
</style>
