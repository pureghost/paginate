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
            if(this.urlSync) {
                var params = this.queryParams(),
                    url = window.location.href,
                    state = {'page': page};
                if (!this.popStateListening) {
                    var that = this;
                    this.popStateListening = true;
                    window.addEventListener("popstate", function() {
                        that.$emit('turn', window.history.state.page);
                    });
                }
                if (!window.history.state) {
                    window.history.replaceState({'page': this.currentPage}, '', url);
                }
                if (!params.length) {
                    window.history.pushState(state, '', url + '?' + this.pageName + '=' + page);
                } else if (params[this.pageName]) {
                    window.history.pushState(state, '', url.replace(new RegExp('(' + this.pageName + '=)\\d+'), '$1' + page));
                } else {
                    window.history.pushState(state, '', url + '&' + this.pageName + '=' + page);
                }
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
        },
        queryParams: function() {
            var vars = [], hash, index = window.location.href.indexOf('?');
            if(index < 0) {
                return [];
            } else {
                var hashes = window.location.href.slice(index + 1).split('&');
                for (var i = 0; i < hashes.length; i++) {
                    hash = hashes[i].split('=');
                    vars.push(hash[0]);
                    vars[hash[0]] = hash[1];
                }
                return vars;
            }
        }
    },
    props: {
        side: {
            type: Number,
            default: 1
        },
        centerSide: {
            type: Number,
            default: 4
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
        },
        urlSync: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        showCount: function () {
            return Math.min(this.lastPage, (this.centerSide + this.side) * 2 + 1);
        },
        halfCenterCount: function () {
            return parseInt((this.showCount - this.side * 2) / 2);
        },
        headEnd: function () {
            return Math.min(this.lastPage, this.side);
        },
        tailShowCount: function () {
            return Math.min(this.side, Math.max(this.lastPage - this.side, 0));
        },
        tailOffset: function () {
            return this.lastPage - this.tailShowCount;
        },
        headEllipsis: function () {
            return this.lastPage > this.showCount && this.currentPage > this.side + this.halfCenterCount + 1;
        },
        tailEllipsis: function () {
            return this.lastPage > this.showCount && this.currentPage < this.lastPage - this.halfCenterCount - this.side;
        },
        centerCount: function () {
            return this.lastPage > this.side * 2
                ? this.lastPage <= this.showCount
                    ? this.lastPage - this.side * 2
                    : this.showCount - this.side * 2
                : 0;
        },
        centerOffset: function () {
            return !this.tailEllipsis
                ? this.lastPage - this.showCount + this.side
                : this.headEllipsis
                    ? this.currentPage - this.halfCenterCount - 1
                    : this.side;
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