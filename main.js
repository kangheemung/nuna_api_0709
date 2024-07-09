url=``;
let news=[]
const getLatestNews = async () => {
    const url = new URL(`https://sweet-conkies-3c5540.netlify.app/`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch news data');
        }
        const data = await response.json();
        console.log(data);
        newsList = data.articles;
        render();
    } catch (error) {
        console.error('Error fetching or parsing data:', error.message);
    }
};
getLatestNews();