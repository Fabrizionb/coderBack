/* eslint-disable */
import { Faker, en, es, base } from '@faker-js/faker'

const faker = new Faker({
  locale: [en, es, base]
})
class MockingService {

   generateProduct () {
    const categories = ['Jackets', 'Dresses', 'Sweeters', 'Pants', 'Shirts']

    const productNamesByCategory = {
      Jackets: ['Leather Jacket', 'Denim Jacket', 'Sport Jacket'],
      Dresses: ['Casual Dress', 'Evening Dress', 'Summer Dress'],
      Sweeters: ['Wool Sweater', 'V-neck Sweater', 'Cardigan'],
      Pants: ['Jeans', 'Chinos', 'Corduroy Pants'],
      Shirts: ['Polo Shirt', 'Oxford Shirt', 'Dress Shirt']
    }

    const productDescriptionsByCategory = {
      Jackets: ['Warm and comfortable', 'Suitable for any weather', 'Stylish and modern'],
      Dresses: ['Perfect for any occasion', 'Elegant and refined', 'Light and colorful'],
      Sweeters: ['Soft and cozy', 'Classic style', 'Comfortable for everyday use'],
      Pants: ['Durable and versatile', 'Ideal for work or casual wear', 'Trendy and unique'],
      Shirts: ['Professional and crisp', 'Casual yet sophisticated', 'Perfect for any outfit']
    }

    const category = faker.helpers.arrayElement(categories)
    const title = faker.helpers.arrayElement(productNamesByCategory[category])
    const description = faker.helpers.arrayElement(productDescriptionsByCategory[category])
    const status = faker.datatype.boolean(0.5)

    const product = {
      _id: faker.database.mongodbObjectId(),
      title,
      description,
      price: faker.commerce.price({ min: 100, max: 200 }),
      code: faker.string.alphanumeric(6),
      category,
      stock: status ? faker.number.int({ min: 1, max: 50 }) : 0,
      status,
      thumbnails: Array.from({ length: 2 }, () => faker.image.urlPicsumPhotos())
    }

    return product
  }
}

export default MockingService
