import { S3 } from '@aws-sdk/client-s3';
//import fs from 'node:fs';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';

const s3 = new S3({
    region: 'us-west-1'
  });
const db = sql('meals.db');

export async function getMeals() {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    //throw new Error('Loading Meals Failed');
    return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    const extension = meal.image.name.split('.').pop();
    const rando = Math.floor(Math.random() * 1000);
    const fileName = `${meal.slug}${rando}.${extension}`;
    const bufferedImage = await meal.image.arrayBuffer();
    
    s3.putObject({
        Bucket: 'andiskene-nextjs-demo-users-image',
        Key: fileName,
        Body: Buffer.from(bufferedImage),
        ContentType: meal.image.type,
      });

/*  //this is for storing files on the local system
     const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await meal.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
        if(error) {
            throw new Error('Saving image failed!');
        }
    });
 */
    meal.image = fileName;

    db.prepare(`
        INSERT INTO meals
        (title, summary, instructions, creator, creator_email, image, slug)
        VALUES
        (@title,
        @summary,
        @instructions,
        @creator,
        @creator_email,
        @image,
        @slug)
   `).run(meal);
}