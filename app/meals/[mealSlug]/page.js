import Image from "next/image";
import { useRouter } from "next/navigation";
import { getMeal, getMeals } from "@/lib/meals";
import classes from "./page.module.css";
export async function generateStaticParams() {
  const meals = await getMeals();

  return meals.map((meal) => ({
    mealSlug: meal.slug,
  }));
}

export function generateMetadata({ params }) {
  const meal = getMeal(params.mealSlug);

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default function MealDetailsPage({ params }) {
  const router = useRouter();
  const meal = getMeal(params.mealSlug);

  if (!meal) {
    // Redirect to a static 404 page
    if (typeof window !== "undefined") {
      router.push("/404");
    }
    return null;
  }

  meal.instructions = meal.instructions.replace(/\n/g, "<br />");

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image src={meal.image} alt={meal.title} fill />
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
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: meal.instructions,
          }}
        ></p>
      </main>
    </>
  );
}

