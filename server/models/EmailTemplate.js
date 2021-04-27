const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const EmailTemplate = mongoose.model('EmailTemplate', mongoSchema);

async function insertTemplates() {
  const templates = [
    {
      name: 'welcome',
      subject: 'Welcome to Bank It!',
      message: `<%= userName %>,
        <p>
          We are so thankful and excited that you chose us to help you grow.
        </p>
        JD Medlin (CEO),
        Bank It!
      `,
    },
    {
      name: 'newAdvertisement',
      subject: 'You have added a new advertisement!',
      message: `<%= userName %>,
        <p>
          Time to get rock and rollin!
        </p>
        <p>
          If you have any questions while reading the book,
          please fill out an issue on
          <a href="https://${process.env.URL_APP}/help" target="blank">Github</a>.
        </p>

        JD Medlin (CEO),
        Bank It!
      `,
    },
  ];

  for (const t of templates) { // eslint-disable-line
    const et = await EmailTemplate.findOne({ name: t.name }); // eslint-disable-line

    const message = t.message.replace(/\n/g, '').replace(/[ ]+/g, ' ').trim();

    if (!et) {
      EmailTemplate.create({ ...t, message });
    } else if (et.subject !== t.subject || et.message !== message) {
      EmailTemplate.updateOne({ _id: et._id }, { $set: { message, subject: t.subject } }).exec();
    }
  }
}

async function getEmailTemplate(name, params) {
  const et = await EmailTemplate.findOne({ name });

  if (!et) {
    throw new Error(`No email templates found.`);
  }

  return {
    message: _.template(et.message)(params),
    subject: _.template(et.subject)(params),
  };
}

exports.insertTemplates = insertTemplates;
exports.getEmailTemplate = getEmailTemplate;
