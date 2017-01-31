$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback, timeout));
  });
};

function appendClass(elem, className) {
    elem.className += ` ${className}`;
}

function getAncestorElem(elem, generationNum) {
    for (let i = 0; i < generationNum; i++) {
        elem = elem.parentElement;
    }
    return elem;
}

class TweetMarkManager {
    constructor() {
        // Mark names don't have meanings at all, but exist to identify.
        this.HIDDEN_MARK = "hidden-k4eRo0"
        this.CHECKED_MARK = "checked-k4eRo0"
    }

    excludeMarkedTweets($tweets) {
        return $tweets.not(`.${this.CHECKED_MARK}`);
    }

    appendCheckedMark(tweet) {
        appendClass(tweet, this.CHECKED_MARK);
    }

    appendHiddenMark(tweet) {
        appendClass(tweet, this.HIDDEN_MARK);

        // Hide wrapper, too.
        let tweetWrapper = this.getTweetWrapper(tweet);
        appendClass(tweetWrapper, this.HIDDEN_MARK);
    }

    getTweetWrapper(tweet) {
        return getAncestorElem(tweet, 3);
    }
}

class TweetContentInspector {
    constructor(filterRegex) {
        this.filterRegex = filterRegex;
    }

    detect(text) {
        return this.filterRegex.test(text);
    }
}

class TweetWalker {
    constructor(filterRegex) {
        this.markManager = new TweetMarkManager();
        this.tweetContentInspector = new TweetContentInspector(filterRegex);
    }

    getAllTweets() {
        return $(".tweet-text");
    }

    walk() {
        let $tweets = this.markManager.excludeMarkedTweets(this.getAllTweets());
        $tweets.each((__, tweet) => {
            let tweetTextContent = tweet.innerText;

            if (this.tweetContentInspector.detect(tweetTextContent)) {
                this.markManager.appendHiddenMark(tweet);
            }

            this.markManager.appendCheckedMark(tweet);
        });
    }
}

// Main Process
chrome.storage.sync.get({
        regex: "Delete this. And then input text you want to filter by harukaeru"
    }, function(items) {
        let filterRegex = new RegExp(items.regex);
        let tweetWalker = new TweetWalker(filterRegex);

        // Alias
        let walk = tweetWalker.walk();

        walk();

        $("#timeline").on('click', function() {
            walk();
        });

        $(window).scrollEnd(function(){
            walk();
        }, 100);
    }
);
