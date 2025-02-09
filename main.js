//버튼들에 클릭이벤트를 주기
//카테고리별 뉴스 가져오기
//그 뉴스를 보여주기렌더
// 버튼 클릭 이벤트 추가
const API_KEY = `#`;
let newsList = [];
let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

let url = new URL(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`);
const menus= document.querySelectorAll(".menus button");
const sidebar = document.querySelectorAll('.sidebar');
const side_menus = document.querySelectorAll(".side_menus");
const side_menus_box = document.querySelectorAll('.side_menus_box button');
const keywordInput = document.getElementById("input_search");
const inputGoButton = document.getElementById("input_go");
const hamburger = document.getElementById('hamburger');
//const sideMenus = document.querySelector('.side_menus');//페이지네이션
//totalResult/PageSize올림
let keyword = '';

// 검색창을 클릭하여 토글하는 기능 추가
let isSearchInputVisible = false;
// Define toggleSearchInput function in the global scope
const toggleSearchInput = () => {
    isSearchInputVisible = !isSearchInputVisible;
    const bodyBox = document.getElementById("body_search_box");
    console.log(bodyBox);
    if(isSearchInputVisible)  {
        bodyBox.style.display = 'none';
    } else {
        bodyBox.style.display = 'block';
    }
};
let sidebarIsOpen = false;

const toggleSidebar = () => {
    sidebarIsOpen = !sidebarIsOpen; // Toggle the sidebarIsOpen variable

    if (sidebarIsOpen) {
        side_menus.forEach(menu => menu.style.display = 'block'); // Hide each sidebar menu
    } else {
        side_menus.forEach(menu => menu.style.display = 'none'); // Show each sidebar menu
    }
    document.getElementById('x-close').addEventListener('click', function() {
        side_menus.forEach(menu => menu.style.display = 'none');
    });
};
//サイドバー完成バーグ修正完了
hamburger.addEventListener('click', (e) => {
    toggleSidebar();
});

side_menus_box.forEach(menu => {
    menu.addEventListener("click", (e) => {
        e.stopPropagation(); // Stop the event from propagating to the parent elements
        getNewsByCategory(e);
        toggleSidebar();
        getNews();
        document.querySelector('.side_menus').classList.remove('opened');
    });
});
// You can keep the existing code for toggleSearchInput function here

// Enterキーが押された時の処理

// Ensure the toggleSearchInput function is accessible globally

// Define the closeSidebar function

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
const getNewsByCategory = async (e) => {
    try {
          const category = e.target.textContent.toLowerCase();
          url.searchParams.set('category', category);
          url.searchParams.set('q', '');
          await getNews();
      } catch (error) {
        errorRender(error.message)
    }
};

inputGoButton.addEventListener('click', getNewsByKeyword);

keywordInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        getNewsByKeyword();
    }
});
const getNews = async () => {
    try {
        url.searchParams.set("page",page);//and ＆page=page
        url.searchParams.set("pagesize",pageSize);

        const response = await fetch(url);
        console.log (response);
        const data = await response.json();
        console.log (data);
        if (response.status === 200) {
            newsList = data.articles;
            //page情報
            totalResult = data.totalResults;
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
            url.searchParams.set('q', '');
            await getNews();
};

menus.forEach(menu => menu.addEventListener("click",(e) => getNewsByCategory(e)));
// Add click event listener for the hamburger menu button
// Add click event listener to each button in side_menus_box
console.log(hamburger);
// Function to toggle the visibility of the sidebar
// Add click event listener to x-close element if it exists
// Function to close the sidebar
// Add click event listener to 'x-close' element to close the sidebar
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
// Get the x-close element
//페이지네이션 함수
//질문1. 총 결과의 개수 가지고 몇개의 페이지가 필요한지 알 수 있을까?
//totalPages/groupSize(올림)

//질문2. 현재 페이지를 가지고 몇번째 페이지 그룹인지 어떻게 알 수 있을까?
//page/groupSize(올림)
//질문3. 페이지 그룹번호를 가지고 어떻게 그 그룹의 마지막 페이지와 첫번째 페이지를 알 수 있을까?



const paginationRender = ()=> {
    //page
    //pageSize
    //pageGroup
    let paginationHTML = ``;
    const totalPages = Math.ceil(totalResult / pageSize);
    const groupSize = 5;
    const pageGroup= Math.ceil(page/5);
    //firstPaget
    //let lastPage = pageGroup * groupSize;
    // 마지막페이지 그룹이그룹사이즈보다 작다? 마지막페이지는lastPage=totalPage
    //firstPage
    let lastPage = pageGroup * 5;
     // 마지막 그룹이 5개 이하이면
    if (lastPage > totalPages){
        lastPage = totalPages;
    }
    let firstPage = lastPage  - 4 <= 0 ? 1 :  lastPage - 4; // 첫그룹이 5이하이면
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




if (page > 1) {
    // Set page number to 1 if it is less than 1
 paginationHTML = `<li class="page-item" onclick="moveToPage(1)">
                        <a class="page-link" aria-label="Previous">
                       &laquo;&laquo;
                        </a>
                      </li>
                      <li class="page-item" onclick="moveToPage(${page-1})">
                        <a class="page-link" aria-label="Previous">
                           &laquo;
                        </a>
                      </li>
                   `;
}
for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
        i === page ? 'active' : ''}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
}


if (page <totalPages) {

paginationHTML += ` <li class="page-item" onclick=" moveToPage(${page+1})">
                        <a class="page-link" aria-label="Last">
                            &raquo;
                        </a>
                     </li>
                    <li class="page-item" onclick="moveToPage(${totalPages})">
                        <a class="page-link" aria-label="Next">
                           &raquo;&raquo;
                        </a>
                    </li>
                    `;
   }
    document.querySelector(".pagination").innerHTML = paginationHTML;

};
const moveToPage = (pageNum) => {
    console.log("moveToPage",pageNum);
    page = pageNum;
    getNews();
};
getLatestNews();
