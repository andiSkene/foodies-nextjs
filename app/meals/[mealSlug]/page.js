import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMeal } from '@/lib/meals';
import classes from './page.module.css';

export async function generateMetadata({ params }) {
    const meal = getMeal(params.mealSlug);
    
    //IF THERE IS NO MEAL BY THAT NAME
    if (!meal) {
        notFound();
    }

    return {
        title: meal.title,
        description: meal.description
    }
}

export default function MealBlogPage({ params }) {
    const meal = getMeal(params.mealSlug);

    //IF THERE IS NO MEAL BY THAT NAME
    if (!meal) {
        notFound();
    }

    //REMOVE THE LINE BREAKS IN THE INSTRUCTIONS
    meal.instructions = meal.instructions.replace(/\n/g, '<br />');

    return <>
        <header className={classes.header}>
            <div className={classes.image}>
                <Image 
                src={`https://andiskene-nextjs-demo-users-image.s3.amazonaws.com/${meal.image}`} 
                alt={meal.title} 
                fill />
            </div>
            <div className={classes.headerText}>
                <h1>{meal.title}</h1>
                <p className={classes.creator}>
                    by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a> 
               </p>
                <p className={classes.summary}>{meal.summary}</p>
            </div>
        </header>
        <main>
            <p className={classes.instructions} dangerouslySetInnerHTML={{
                __html: meal.instructions,
            }}></p>
        </main>
    </>
}