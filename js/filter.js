$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback, timeout));
  });
};

HTMLElement.prototype.appendClass = function(className) {
    this.className += ` ${className}`;
}

HTMLElement.prototype.getAncestorElem = function(generationNum) {
    let elem = this;
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

    excludeCheckedMarkTweets($tweets) {
        return $tweets.not(`.${this.CHECKED_MARK}`);
    }

    appendCheckedMark(tweet) {
        tweet.appendClass(this.CHECKED_MARK);
    }

    appendHiddenMark(tweet) {
        tweet.appendClass(this.HIDDEN_MARK);

        // Hide wrapper, too.
        let tweetWrapper = this.getTweetWrapper(tweet);
        tweetWrapper.appendClass(this.HIDDEN_MARK);
    }

    getTweetWrapper(tweet) {
        return tweet.getAncestorElem(3);
    }
}

class TextInspector {
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
        this.textInspector = new TextInspector(filterRegex);
    }

    getAllTweets() {
        return $(".tweet-text");
    }

    walk() {
        let $tweets = this.markManager.excludeCheckedMarkTweets(this.getAllTweets());
        $tweets.each((__, tweet) => {
            if (this.textInspector.detect(tweet.innerText)) {
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
        let w = tweetWalker.walk;
        w();

        $("#timeline").on('click', function() {
            w();
        });

        $(window).scrollEnd(function(){
            w();
        }, 100);
    }
);
