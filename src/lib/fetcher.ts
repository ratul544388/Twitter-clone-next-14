import axios from "axios";

export async function fetcher(url: string) {
  await axios.get(url).then(({ data }) => {
    return data;
  });
}
