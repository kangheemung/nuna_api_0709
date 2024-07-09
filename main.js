
let news=[]
const getLatestNews = async () => {
    const url = `https://main--kaleidoscopic-beignet-ca4459.netlify.app/top-headlines`
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        newsList = data.articles;
        render();
    } catch (error) {
        console.error('Error fetching or parsing data:', error.message);
    }
};
getLatestNews();