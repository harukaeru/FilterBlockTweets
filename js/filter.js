$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};

function getParentTweetLi(elem) {
    return elem.parentElement.parentElement.parentElement;
};
function addHideMark(elem) {
    let tweetLi = getParentTweetLi(elem);
    elem.className += " hide-k4eRo0";
    tweetLi.className += " hide-k4eRo0";
};
function addCheckedMark(elem) {
    elem.className += " checked-k4eRo0";
}

class FilterBlocker {
    constructor(filterRegex) {
        this.filterRegex = filterRegex;
    }
    filterAllTweets() {
        var i = 0;
        let tweets = $(".tweet-text").not(".hide-k4eRo0").not(".checked-k4eRo0");
        console.log('len', tweets.length);
        tweets.each((i, elem) => {
            let text = elem.innerText;
            if (this.filterRegex.test(text)) {
                addHideMark(elem);
            } else {
                addCheckedMark(elem);
            }
        });
    }
}

let regex = chrome.storage.sync.get({
        regex: "Delete this. And then input text you want to filter by harukaeru"
    }, function(items) {
        let re = new RegExp(items.regex);
        console.log("REGEX");
        console.log(re);
        let filterBlocker = new FilterBlocker(re);
        filterBlocker.filterAllTweets();

        $("#timeline").on('click', function() {
            filterBlocker.filterAllTweets();
        });

        $(window).scrollEnd(function(){
            filterBlocker.filterAllTweets();
        }, 100);
    }
);
