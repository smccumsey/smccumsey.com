<template lang="html">
  <div class="admin">
    <section class="admin__auth">
      <div id="my-signin2"></div>
      <a href="#" @click="signOut">Sign out</a>
    </section>
    <create-event-form @submitEvent="pushEvent"></create-event-form>
  </div>
</template>

<script>
import CreateEventForm from '@/components/CreateEventForm';

const AWS = require('aws-sdk');
const AWSCognito = require('../../static/js/amazon-cognito.min.js')

export default {
  components: {
    CreateEventForm
  },
  data() {
    return {
      ddb: null,
    };
  },
  methods: {
    init() {
      gapi.load('auth2', () => {});
    },
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
    pushEvent(data) {
      const params = {
        TableName: 'Events',
        Item: {
          EventId: { N: `${new Date().valueOf()}` },
          EventName: { S: data.title },
          ContactName: { S: data.name },
          startDate: { S: `${data.startDate}` },
          endDate: { S: `${data.endDate}` },
          DateCreated: { S: `${new Date()}` }
        },
      };

      // Call DynamoDB to add the item to the table
      this.ddb.putItem(params, (err, data) => {
        if (err) {
          console.log('Error', err);
        } else {
          console.log('Success', data);
        }
      });
      const describeParams = {
        TableName: 'Events' /* required */
      };
      this.ddb.describeTable(describeParams, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
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
      this.ddb = new AWS.DynamoDB();
    },
    signOut() {
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut().then(function () {
        console.log('User signed out.');
      });
    }
  },
  mounted() {
    this.init();
    this.renderButton();
  },
};

</script>

<style lang="css">
  .admin {
    width: 100%;
  }
  .admin__auth {
    margin: 40px 10px;
    padding: 10px;
    display: grid;
    justify-items: center;
    grid-row-gap: 20px;
  }
  .admin__create {
  }

</style>
