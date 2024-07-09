//버튼들에 클릭이벤트를 주기
//카테고리별 뉴스 가져오기
//그 뉴스를 보여주기렌더
const menus= document.querySelectorAll(".menus button")
menus.forEach(menus=>menus.addEventListener("click",(e=>getNewsByCategory(e))))
console.log(menus);
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
const getNewsByCategory = (e) => {
    const category = e.target.textContent.toLowerCase();
      console.log("category", category);
    const url = new URL(
        `https://main--kaleidoscopic-beignet-ca4459.netlify.app/top-headlines?category=${category}`
    );
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Data", data);
            newsList = data.articles;
            render()
        })
        .catch(error => console.error('Error fetching or parsing data:', error.message));
};

const getNewsByKeyword = (keyword) => {
    if (typeof keyword === 'undefined') {
        const keyword = document.getElementById("search-input").value;
    }

      console.log("keyword", keyword);

     const url = new URL(` https://newsapi.org/v2/top-headlines?q=${keyword}`);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Data for keyword", keyword, ":", data);
            newsList = data.articles;
            console.log(newsList);
            render();
        })
        .catch(error => console.error('Error fetching or parsing data:', error.message));
};


const render = () => {
    const newsHTML = newsList.map(news => {
        const imageSrc = news.urlToImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU";
        const summary = news.description && news.description.length > 200 ? news.description.substring(0, 200) + '...' : news.description || '내용없음';
        const sourceName = news.source.name || 'no source';
        const publishedTime = moment(news.publishedAt, "YYYYMMDD").fromNow();

        return `<div class ="row news">
                    <div class ="col-lg-4">
                        <img class="news_size"
                        src=${imageSrc} "/>
                    </div>
                    <div class ="col-lg-8">
                        <h2>${news.title}</h2>
                        <p>
                         ${summary}
                        </p>
                        <div>
                            ${sourceName} ${publishedTime}
                        </div>
                    </div>
                </div>`;
        }).join("");

    document.getElementById("news-board").innerHTML = newsHTML;
  };