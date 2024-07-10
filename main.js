//버튼들에 클릭이벤트를 주기
//카테고리별 뉴스 가져오기
//그 뉴스를 보여주기렌더
// 버튼 클릭 이벤트 추가
const input_go = document.getElementById("input_go");
const keywordInput = document.getElementById("search-input");
const menus= document.querySelectorAll(".menus button");
const hamburger = document.getElementById('hamburger');
const sidebar = document.querySelector('.sidebar');
const side_menus = document.querySelectorAll(".side_menus");

let keyword = '';

const getNewsByKeyword = () => {
    keyword = keywordInput.value.trim(); // Update the global 'keyword' variable
    if (keyword.trim() === '') {
        // Add a placeholder message to the input element
        keywordInput.placeholder = '키워드를 입력해주세요';
        return; // Stop further execution of the function
    }
   // if (keyword.trim() !== '') {
     //   url.searchParams.set('q', keyword);
    //} else {
      //  url.searchParams.delete('q'); // Remove the 'q' parameter if keyword is empty
   // }
    url.searchParams.set('q', keyword); // Set the 'q' parameter in the URL
    url.searchParams.delete('category');
    getNews();
    keywordInput.value = ''; // Reset the input field value
};

const getNewsByCategory = (e) => {
    try {
          const category = e.target.textContent.toLowerCase();
          url.searchParams.set('category', category);
          url.searchParams.set('q', '');
          getNews();
      } catch (error) {
        errorRender(error.message)
    }
};
hamburger.addEventListener('click', () => {
    side_menus.forEach(side_menu => side_menu.classList.toggle('show')); 
});
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.side_menus').classList.toggle('opened');
});
// Close the sidebar when a button inside side_menus is clicked
side_menus.forEach(side_menu => side_menu.addEventListener("click", (e) => {
    getNewsByCategory(e); // Perform category selection action
    document.querySelector('.side_menus').remove('opened'); // Close the sidebar
}));



menus.forEach(menu => {
    menu.addEventListener("click", getNewsByCategory);
});
// Enterキーが押された時の処理
keywordInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        getNewsByKeyword();
    }
});

input_go.addEventListener('click', getNewsByKeyword);
//console.log(menus);
let news=[];
let url = new URL(`https://main--kaleidoscopic-beignet-ca4459.netlify.app/top-headlines`);
const getNews = async () => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (response.status === 200) {
            newsList = data.articles;
            if (data.articles.length === 0)  {
                errorRender("No matches for your search");
            } else {
                newsList = data.articles;
                render();
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        errorRender(error.message);
    }
};


const getLatestNews = async () => {
            url = new URL(`https://main--kaleidoscopic-beignet-ca4459.netlify.app/top-headlines`);
            url.searchParams.set('q', '');
            await getNews();
};
getLatestNews();

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
  console.log("keyword", keyword);

  const errorRender = (errorMessage) => {

    const errorHTML = `<div class="alert alert-danger" role="alert">${errorMessage}</div>`;
    document.getElementById("news-board").innerHTML = errorHTML;
};
getLatestNews();
