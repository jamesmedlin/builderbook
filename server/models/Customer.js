const mongoose = require('mongoose');
const _ = require('lodash');

// const { addToMailchimp } = require('../mailchimp');
const generateSlug = require('../utils/slugify');
const sendEmail = require('../aws-ses');
const { getEmailTemplate } = require('./EmailTemplate');
const logger = require('../logger');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  googleToken: {
    access_token: String,
    refresh_token: String,
    token_type: String,
    expiry_date: Number,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  displayName: String,
  avatarUrl: String,

  advertisements: [String],
});

class CustomerClass {
  static publicFields() {
    return ['id', 'displayName', 'email', 'avatarUrl', 'slug', 'isAdmin', 'advertisements'];
  }

  static async signInOrSignUp({ googleId, email, googleToken, displayName, avatarUrl }) {
    const customer = await this.findOne({ googleId }).select(
      CustomerClass.publicFields().join(' '),
    );

    if (customer) {
      const modifier = {};

      if (googleToken.accessToken) {
        modifier.access_token = googleToken.accessToken;
      }

      if (googleToken.refreshToken) {
        modifier.refresh_token = googleToken.refreshToken;
      }

      if (_.isEmpty(modifier)) {
        return customer;
      }

      await this.updateOne({ googleId }, { $set: modifier });

      return customer;
    }

    const slug = await generateSlug(this, displayName);

    const newCustomer = await this.create({
      createdAt: new Date(),
      googleId,
      email,
      googleToken,
      displayName,
      avatarUrl,
      slug,
    });

    try {
      const template = await getEmailTemplate('welcome', {
        userName: displayName,
      });

      await sendEmail({
        from: `JD from Bank It! <${process.env.EMAIL_ADDRESS_FROM}>`,
        to: [email],
        subject: template.subject,
        body: template.message,
      });
    } catch (err) {
      logger.debug('Email sending error:', err);
    }

    // try {
    //   await addToMailchimp({ email, listName: 'signedup' });
    // } catch (error) {
    //   logger.error('Mailchimp error:', error);
    // }

    return _.pick(newCustomer, CustomerClass.publicFields());
  }
}

mongoSchema.loadClass(CustomerClass);

const Customer = mongoose.model('Customer', mongoSchema);

module.exports = Customer;
