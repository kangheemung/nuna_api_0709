//버튼들에 클릭이벤트를 주기
//카테고리별 뉴스 가져오기
//그 뉴스를 보여주기렌더
// 버튼 클릭 이벤트 추가
const keywordInput = document.getElementById("search-input");
const input_go = document.getElementById("input_go");

const menus= document.querySelectorAll(".menus button");
const hamburger = document.getElementById('hamburger');
const sidebar = document.querySelector('.sidebar');
const side_menus = document.querySelectorAll(".side_menus");
let closeButton = document.querySelector('.x-close');
//페이지네이션
//totalResult/PageSize올림
let keyword = '';

// 검색창을 클릭하여 토글하는 기능 추가
let isSearchInputVisible = false;
// Define toggleSearchInput function in the global scope
const toggleSearchInput = () => {

    if(isSearchInputVisible)  {
        keywordInput.style.display === "none";
        input_go.style.display === "none";
    } else {
        keywordInput.style.display = 'block';
        input_go.style.display = 'block';
    }
    isSearchInputVisible = !isSearchInputVisible;
};

// You can keep the existing code for toggleSearchInput function here

// Ensure the toggleSearchInput function is accessible globally


// 나머지 코드는 그대로 유지
 // 검색창 클릭 이벤트 추가

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
let url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);

//console.log(menus);
let news=[];

const getNews = async () => {
    try {
        let page = 1;

        const pageSize = 10;
        const groupSize = 5;
        url.searchParams.set("page",page);//and page=page
        url.searchParams.set("pagesize",pageSize);
        const response = await fetch(url);
        console.log (response);
        const data = await response.json();
        console.log (data);
        if (response.status === 200) {
            newsList = data.articles;
            totalResult=data.totalResult;
            render();
            paginationRender()
            console.log()
            if (data.articles.length === 0)  {
                errorRender("No matches for your search");
            } else {
                newsList = data.articles;
                render();
                paginationRender()
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        errorRender(error.message);
    }
};

const getLatestNews = async () => {
            url = new URL(`https://noona-times-be-5ca9402f90d9.herokuapp.com/top-headlines`);
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
// 'X' 버튼을 클릭하여 사이드 메뉴가 닫히도록 설정
const closeSidebar = () => {
    sidebar.classList.remove('opened');
};

document.querySelector('.side_menus').addEventListener('click', (e) => {
    if ((e.target.tagName === 'BUTTON' && e.target.textContent.toLowerCase() === 'x') || e.target.classList.contains('x-close')) {
        closeSidebar();
    }
});


//페이지네이션 함수



const paginationRender =()=> {
    //totalResult
    //page
    //pageSize
    //pageGroup
    const pageSize = 10;
    let page = 1;
    const totalPages = Math.ceil(totalResult / pageSize);
    const groupSize = 5;
    const pageGroup= Math.ceil(page/groupSize);
    //firstPaget
    const lastPage = pageGroup*groupSize;
    // 마지막페이지 그룹이그룹사이즈보다 작다? 마지막페이지는lastPage=totalPage
    //firstPage
    if (lastPage>totalPages){
        lastPage=totalPages;
    }

    const firstPage=lastPage-(groupSize - 1) <= 0? 1:lastPage-(groupSize - 1);
    //<nav aria-label="Page navigation example">
      //  <ul class="pagination justify-content-center">
        //    <li class="page-item disabled">
        //    <a class="page-link">Previous</a>
          //  </li>
          //  <li class="page-item"><a class="page-link" href="#">1</a></li>
          //  <li class="page-item"><a class="page-link" href="#">2</a></li>
          //  <li class="page-item"><a class="page-link" href="#">3</a></li>
          //  <li class="page-item">
           // <a class="page-link" href="#">Next</a>
           // </li>
        //</ul>
   // </nav>
   let paginationHTML = ``

for (let i= firstPage; i<= lastPage; i++){

    paginationHTML += `<li class = "page-item" ${ i === page ? 'active':'' }onclick= "moveToPage(${i})" ><a class="page-link" href="#">${i}</a></li>`
}
document.querySelector(".pagination").innerHTML = paginationHTML;

}

const moveToPage = (pageNum) => {
    console.log("moveToPage",pageNum)
    page = pageNum;
    getNews();
}
getLatestNews();
