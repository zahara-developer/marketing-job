import Resource from '../models/Resource.js';

const fallbackResources = [
  {
    title: 'Fundamentals of Digital Marketing',
    type: 'Course',
    description: 'A strong starting point for understanding acquisition channels, campaigns, and customer journeys.',
    link: 'https://skillshop.withgoogle.com/'
  },
  {
    title: 'HubSpot Academy Sales Training',
    type: 'Training',
    description: 'Practical lessons on pipeline management, relationship building, and inbound sales fundamentals.',
    link: 'https://academy.hubspot.com/'
  },
  {
    title: 'SEO Starter Guide',
    type: 'Guide',
    description: 'Helpful reading for anyone exploring search visibility, site quality, and organic growth strategy.',
    link: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide'
  }
];

export const getResources = async (_req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(200).json(fallbackResources);
    }

    const resources = await Resource.find().sort({ createdAt: 1 });
    return res.status(200).json(resources);
  } catch (error) {
    return res.status(200).json(fallbackResources);
  }
};
