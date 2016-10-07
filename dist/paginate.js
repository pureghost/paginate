var paginate = Vue.extend({
    template: '\
<ul v-if="lastPage > 1" class="pagination">\
    <li v-if="activePrev"><a @click="prev()" href="javascript:void(0)">{{ prevText }}</a></li>\
    <li v-else class="disabled"><span>{{ prevText }}</span></li>\
\
    <li v-for="n in headEnd" :class="{active: isActive(n)}">\
        <span v-if="isActive(n)">{{ n }}</span>\
        <a v-else @click="turn(n)" href="javascript:void(0)">{{ n }}</a>\
    </li>\
\
    <li v-if="headEllipsis" class="disabled"><span>...</span></li>\
\
    <li v-for="n in centerCount" :class="{active: isActive(n + centerOffset)}">\
        <span v-if="isActive(n + centerOffset)">{{ n + centerOffset }}</span>\
        <a v-else @click="turn(n + centerOffset)" href="javascript:void(0)">{{ n + centerOffset }}</a>\
    </li>\
\
    <li v-if="tailEllipsis" class="disabled"><span>...</span></li>\
\
    <li v-for="n in tailShowCount" :class="{active: isActive(n + tailOffset)}">\
        <span v-if="isActive(n + tailOffset)">{{ n + tailOffset }}</span>\
        <a v-else @click="turn(n + tailOffset)" href="javascript:void(0)">{{ n + tailOffset }}</a>\
    </li>\
\
    <li v-if="activeNext"><a @click="next()" href="javascript:void(0)">{{ nextText }}</a></li>\
    <li v-else class="disabled"><span>{{ nextText }}</span></li>\
</ul>',
    methods: {
        turn: function (page) {
            var urlVars = $.getUrlVars(),
                url = location.href,
                state = {'page': page};
            if (!this.popStateListening) {
                var that = this;
                this.popStateListening = true;
                window.addEventListener("popstate", function() {
                    that.$emit('turn', history.state.page);
                });
            }
            if (history.state == null) {
                history.replaceState({'page': this.currentPage}, '', location.href);
            }
            if (urlVars.length == 0) {
                history.pushState(state, '', url + '?' + this.pageName + '=' + page);
            } else if (urlVars[this.pageName]) {
                history.pushState(state, '', url.replace(/(page=)\d+/, '$1' + page));
            } else {
                history.pushState(state, '', url + '&page=' + page);
            }
            this.$emit('turn', page);
        },
        prev: function () {
            this.turn(this.currentPage - 1);
        },
        next: function () {
            this.turn(this.currentPage + 1);
        },
        isActive: function (n) {
            return this.currentPage == n;
        }
    },
    props: {
        centerSideCount: {
            type: Number,
            default: 3
        },
        sideCount: {
            type: Number,
            default: 2
        },
        lastPage: {
            type: Number,
            required: true
        },
        currentPage: {
            type: Number,
            required: true
        },
        pageName: {
            type: String,
            default: 'page'
        },
        prevText: {
            type: String,
            default: '«'
        },
        nextText: {
            type: String,
            default: '»'
        }
    },
    computed: {
        showCount: function () {
            return Math.min(this.lastPage, (this.centerSideCount + this.sideCount) * 2 + 1);
        },
        halfCenterCount: function () {
            return parseInt((this.showCount - this.sideCount * 2) / 2);
        },
        headEnd: function () {
            return Math.min(this.lastPage, this.sideCount);
        },
        tailShowCount: function () {
            return Math.min(this.sideCount, Math.max(this.lastPage - this.sideCount, 0));
        },
        tailOffset: function () {
            return this.lastPage - this.tailShowCount;
        },
        headEllipsis: function () {
            return this.lastPage > this.showCount && this.currentPage > this.sideCount + this.halfCenterCount + 1;
        },
        tailEllipsis: function () {
            return this.lastPage > this.showCount && this.currentPage < this.lastPage - this.halfCenterCount - this.sideCount;
        },
        centerCount: function () {
            return this.lastPage > this.sideCount * 2
                ? this.lastPage <= this.showCount
                    ? this.lastPage - this.sideCount * 2
                    : this.showCount - this.sideCount * 2
                : 0;
        },
        centerOffset: function () {
            return !this.tailEllipsis
                ? this.lastPage - this.showCount + this.sideCount
                : this.headEllipsis
                    ? this.currentPage - this.halfCenterCount - 1
                    : this.sideCount;
        },
        activePrev: function () {
            return this.currentPage > 1;
        },
        activeNext: function () {
            return this.currentPage < this.lastPage;
        }
    },
    data: function () {
        return {
            'popStateListening': false
        }
    }
});