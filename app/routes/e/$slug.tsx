import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";


export const loader = async ({ request, params }: LoaderArgs) => {
  // Need to figure how is the best way to show this. Passing a search param with email? Generate a unique response Id linked to an email?
  // make it open to anyone with the link that has an email search param?
  console.log(request, params)
  return null;
};

export default function AnswerSurvey() {

}