<template lang="html">
  <div class="">
    <button type="button" name="button" @click="addEvent">Add Event</button>
    <a href="#" @click="signOut">Sign out</a>
    <div id="my-signin2"></div>
  </div>
</template>

<script>
const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB();

export default {
  data() {
    return {};
  },
  methods: {
    // init() {
    //   gapi.load('auth2', () => { // Ready. });
    // },
    renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': this.onSuccess,
        'onfailure': this.onFailure
      });
    },
    addEvent() {
      const params = {
        TableName: 'Events',
        Item: {
          EventId: { N: '001' },
          EventName: { S: 'party' },
        },
      };

      // Call DynamoDB to add the item to the table
      ddb.putItem(params, (err, data) => {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success', data);
        }
      });
    },
    onFailure() {
      alert('sign-in failed')
    },
    onSuccess(googleUser) {
      // Useful data for your client-side scripts:
      const profile = googleUser.getBasicProfile();
      console.log(`ID: ${profile.getId()}`); // Don't send this directly to your server!
      console.log(`Full Name: ${profile.getName()}`);
      console.log(`Given Name: ${profile.getGivenName()}`);
      console.log(`Family Name: ${profile.getFamilyName()}`);
      console.log(`Image URL: ${profile.getImageUrl()}`);
      console.log(`Email: ${profile.getEmail()}`);

      // The ID token you need to pass to your backend:
      const idToken = googleUser.getAuthResponse().id_token;
      console.log(`ID Token: ${idToken}`);

      // Add the Google access token to the Cognito credentials login map.
      AWS.config.region = 'us-west-2'; // Region
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-west-2:7758ce3f-4c8c-4bbf-a926-f17ea8612f94',
        Logins: {
          'accounts.google.com': idToken,
        },
      });
      // Obtain AWS credentials
      AWS.config.credentials.get(() => {
        // Access AWS resources here.
        var syncClient = new AWS.CognitoSyncManager();
        syncClient.openOrCreateDataset('myDataset', (err, dataset) => {
          dataset.put('myKey', 'myValue', (err, record) => {
            dataset.synchronize({
              onSuccess: (data, newRecords) => {
              },
            });
          });
        });
      });
    },
    signOut() {
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
    }
  },
  mounted() {
    this.renderButton();
  },
};

</script>

<style lang="css">
</style>
