/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

const generateSlug = require('../utils/slugify');
// const Customer = require('./Customer');
// const Purchase = require('./Purchase');

// const { addToMailchimp } = require('../mailchimp');

// const logger = require('../logger');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  _partition: {
    type: String,
  },
  owner: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
  },
  cpcv: {
    type: Number,
  },
  dailyBudget: {
    type: Number,
  },
  isActive: {
    type: Boolean,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  question: {
    type: String,
  },
  quiz: {
    type: [String],
  },
  radius: {
    type: Number,
  },
  specifiesLocation: {
    type: Boolean,
  },
  totalOwed: {
    type: Number,
  },
  uri: {
    type: String,
    required: true,
  },
  viewers: [String],
  createdAt: {
    type: Date,
    required: true,
  },
  website: {
    type: String,
  },
});

class AdvertisementClass {
  static async list({ offset = 0, limit = 10 } = {}) {
    const advertisements = await this.find({}).sort({ createdAt: -1 }).skip(offset).limit(limit);
    return { advertisements };
  }

  static async getAdvertisements(userId) {
    const advertisements = await this.find({ owner: userId });
    return { advertisements };
  }

  static async getBySlug({ slug }) {
    const advertisementDoc = await this.findOne({ slug });
    if (!advertisementDoc) {
      throw new Error('Advertisement not found');
    }

    const advertisement = advertisementDoc.toObject();
    return advertisement;
  }

  static async add({ owner, name, uri, website }) {
    const advertisements = await this.find({ owner }, { name: 1 });

    if (JSON.stringify(advertisements).includes(name)) {
      throw new Error(`You already have an advertisement named: ${name}`);
    }

    const slug = await generateSlug(this, name);
    if (!slug) {
      throw new Error(`Error with slug generation for name: ${name}`);
    }
    return this.create({
      owner,
      name,
      slug,
      uri,
      website,
      createdAt: new Date(),
    });
  }

  static async remove({ caller, _id }) {
    const advertisement = await this.findOne({ _id });

    if (!advertisement) {
      throw new Error(`This advertisement does not exist.`);
    }

    if (advertisement.owner !== caller) {
      throw new Error(`You must be the owner of this advertisement to delete it.`);
    }

    return this.deleteOne({
      _id,
    });
  }

  static async edit({
    _id,
    name,
    website,
    question,
    quiz,
    correctAnswer,
    uri,
    longitude,
    latitude,
    radius,
  }) {
    // eslint-disable-next-line no-console
    console.log(_id);
    const advertisement = await this.find({ _id });

    // eslint-disable-next-line no-console
    console.log(advertisement);

    if (!advertisement) {
      throw new Error('Advertisement is not found by id');
    }

    // TODO
    // if (advertisement && advertisement.owner !== userId) {
    //   throw new Error('You do not have permission to edit this advertisement');
    // }

    const modifier = {
      name,
      website,
      question,
      quiz,
      correctAnswer,
      uri,
      longitude,
      latitude,
      radius,
    };

    if (name !== advertisement.name) {
      modifier.name = name;
      modifier.slug = await generateSlug(this, name);
    }

    const editedAdvertisement = await this.findOneAndUpdate(
      { _id },
      { $set: modifier },
      { fields: 'slug', new: true },
    );

    return editedAdvertisement;
  }

  //   static async buy({ book, user, stripeCharge }) {
  //     if (!book) {
  //       throw new Error('Book not found');
  //     }

  //     if (!user) {
  //       throw new Error('User required');
  //     }

  //     const isPurchased =
  //       (await Purchase.find({ userId: user._id, bookId: book._id }).countDocuments()) > 0;
  //     if (isPurchased) {
  //       throw new Error('You already bought this book.');
  //     }

  //     User.findByIdAndUpdate(user._id, { $addToSet: { purchasedBookIds: book._id } }).exec();

  //     try {
  //       await addToMailchimp({ email: user.email, listName: 'purchased' });
  //     } catch (error) {
  //       logger.error('Buy book error:', error);
  //     }

  //     return Purchase.create({
  //       userId: user._id,
  //       bookId: book._id,
  //       amount: book.price * 100,
  //       createdAt: new Date(),
  //       stripeCharge,
  //     });
  //   }
}

mongoSchema.loadClass(AdvertisementClass);

const Advertisement = mongoose.model('Advertisement', mongoSchema);

module.exports = Advertisement;
