<template>
  <div class="shop-page">
    <!-- 快捷导航 -->
    <div class="shortcut">
      <div class="wrapper">
        <ul>
          <li><a href="#">个人中心</a></li>
          <li><a href="#">我的订单</a></li>
          <li><a href="#"><span class="iconfont icon-xiaoxi"></span>消息中心</a></li>
          <li><a href="#">帮助中心</a></li>
          <li><a href="#">在线客服</a></li>
          <li><a href="#"><span class="iconfont icon-shezhi"></span>设置</a></li>
          <li><a href="#"><span class="iconfont icon-phone-01"></span>手机版</a></li>
        </ul>
      </div>
    </div>

    <!-- 头部区域 -->
    <div class="header wrapper">
      <!-- logo -->
      <div class="logo"><h1><a href="">易购图书</a></h1></div>
      <!-- 搜索 -->
      <div class="search">
        <span class="iconfont icon-sousuo"></span>
        <input type="text" v-model="searchText" @focus="hideSearchPlaceholder = true" @blur="hideSearchPlaceholder = searchText.length > 0">
        <div class="search-placeholder" v-show="!hideSearchPlaceholder && !searchText">
          <span class="placeholder-text" v-html="currentPlaceholder"></span>
        </div>
      </div>
      <!-- 购物车 -->
      <div class="cart">
        <a href="#"><span class="iconfont icon-gouwuche"></span>购物车</a>
      </div>
    </div>

    <!-- banner区域 -->
    <div class="banner" @mouseenter="stopAutoPlay" @mouseleave="startAutoPlay">
      <div class="wrapper">
        <!-- 图片 -->
        <ul class="pic" :style="{ transform: `translateX(${-currentIndex * bannerWidth}px)` }">
          <li v-for="(img, index) in bannerImages" :key="index">
            <a href="#"><img :src="img" alt=""></a>
          </li>
        </ul>
        <!-- 侧栏导航 -->
        <div class="subnav">
          <div class="left">
            <ul>
              <template v-for="(nav, index) in navItems" :key="index">
                <li>
                  <a href="#">{{ nav.title }}</a>
                  <span class="iconfont icon-xiangyou"></span>
                </li>
                <p>{{ nav.desc }}</p>
              </template>
            </ul>
          </div>
          <div class="right"></div>
        </div>

        <!-- 指示器 -->
        <ol>
          <li v-for="(_, index) in bannerImages" :key="index"
              :class="{ active: currentIndex === index }"
              @click="goToSlide(index)">
            <i></i>
          </li>
        </ol>
      </div>
    </div>

    <!-- 易购上新 -->
    <div class="new wrapper">
      <div class="title">
        <div class="left">
          <h3>易购上新</h3>
          <p>易购精选 品质保障</p>
        </div>
        <div class="right">
          <a href="#" class="more">查看全部<span class="iconfont icon-xiangyou"></span></a>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="bd wrapper">
      <ul>
        <li v-for="(item, index) in newProducts" :key="index">
          <a href="#">
            <div class="pic">
              <img :src="item.image" alt="">
            </div>
            <div class="txt">
              <h4>{{ item.title }}</h4>
              <p>￥{{ item.price }}</p>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <!-- 好物推荐 -->
    <div class="new wrapper">
      <div class="title">
        <div class="left">
          <h3>好物推荐</h3>
          <p>中外名著 经典永存</p>
        </div>
        <div class="right">
          <a href="#" class="more">查看全部<span class="iconfont icon-xiangyou"></span></a>
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="bd wrapper">
      <ul>
        <li v-for="(item, index) in recommendProducts" :key="index">
          <a href="#">
            <div class="pic">
              <img :src="item.image" alt="">
            </div>
            <div class="txt">
              <h4>{{ item.title }}</h4>
              <p>￥{{ item.price }}</p>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <!-- 底部区域 -->
    <div class="footer">
      <div class="wrapper">
        <!-- 服务 -->
        <div class="service">
          <ul>
            <li v-for="(service, index) in services" :key="index">
              <h5 :class="'service-icon-' + (index + 1)"></h5>
              <p>{{ service }}</p>
            </li>
          </ul>
        </div>
        <!-- 帮助中心 -->
        <div class="help">
          <div class="left">
            <dl v-for="(help, index) in helpItems" :key="index">
              <dt>{{ help.title }}</dt>
              <dd v-for="(item, idx) in help.items" :key="idx">
                <a v-if="item.link" :href="item.link">{{ item.text }}</a>
                <template v-else>{{ item.text || item }}</template>
              </dd>
            </dl>
          </div>
          <div class="right">
            <ul>
              <li>
                <div class="pic"><img src="@/assets/images/wechat.png" alt=""></div>
                <p>微信公众号</p>
              </li>
              <li>
                <div class="pic"><img src="@/assets/images/app.png" alt=""></div>
                <p>app下载二维码</p>
              </li>
            </ul>
          </div>
        </div>
        <!-- 版权 -->
        <div class="copyright">
          <p>
            <a href="#">关于我们</a>|
            <a href="#">配送验收</a>|
            <a href="#">合作招商</a>|
            <a href="#">销售中心</a>|
            <a href="#">友情链接</a>|
            <a href="#">质量公告</a>
          </p>
          <p>CopyRight © 易购图书</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 搜索相关
const searchText = ref('')
const hideSearchPlaceholder = ref(false)
const placeholderTexts = [
  '搜一搜',
  '<span class="iconfont icon-redu"></span> 热销',
  '猜你喜欢'
]
const currentPlaceholderIndex = ref(0)
const currentPlaceholder = ref(placeholderTexts[0])
let placeholderTimer = null

// 轮播图相关
const bannerWidth = 990
const currentIndex = ref(0)
let autoPlayTimer = null

const bannerImages = ref([
  new URL('@/assets/images/1.png', import.meta.url).href,
  new URL('@/assets/images/2.png', import.meta.url).href,
  new URL('@/assets/images/3.png', import.meta.url).href,
  new URL('@/assets/images/4.png', import.meta.url).href
])

// 侧栏导航数据
const navItems = ref([
  { title: '文学艺术', desc: '小说 文学 艺术 传记' },
  { title: '人文社科', desc: '历史 哲学 宗教 心理' },
  { title: '少儿图书', desc: '儿童文学 启蒙益智' },
  { title: '教育考试', desc: '中小辅导 外语学习' },
  { title: '经济金融', desc: '管理 经济 金融会计' },
  { title: '生活休闲', desc: '烹饪美食 育儿早教' },
  { title: '科学技术', desc: '工业科技 建筑 医学' }
])

// 新品数据
const newProducts = ref([
  { image: new URL('@/assets/images/goods1.png', import.meta.url).href, title: '小幻想家系列丛书(共6册)', price: '61.00' },
  { image: new URL('@/assets/images/goods2.png', import.meta.url).href, title: '"十五五"战略与中国式现代化：新形势、新思路、新举措', price: '69.80' },
  { image: new URL('@/assets/images/goods3.png', import.meta.url).href, title: '台湾百科全书·历史', price: '91.00' },
  { image: new URL('@/assets/images/goods4.png', import.meta.url).href, title: '薛定谔的猫 : 在不确定的世界做确定的自己', price: '49.80' }
])

// 推荐商品数据
const recommendProducts = ref([
  { image: new URL('@/assets/images/goods5.png', import.meta.url).href, title: '朝花夕拾', price: '39.80' },
  { image: new URL('@/assets/images/goods6.png', import.meta.url).href, title: '鼠疫', price: '49.80' },
  { image: new URL('@/assets/images/goods7.png', import.meta.url).href, title: '活着（2021版）', price: '45.00' },
  { image: new URL('@/assets/images/goods8.png', import.meta.url).href, title: '你当像鸟飞往你的山', price: '59.00' }
])

// 服务数据
const services = ref(['价格亲民', '物流快捷', '正版保障', '售后无忧'])

// 帮助中心数据
const helpItems = ref([
  { title: '购物指南', items: ['购物流程', '支付方式', '售后规则'] },
  { title: '配送方式', items: ['配送范围', '配送时间'] },
  { title: '关于我们', items: ['联系我们', '问题反馈'] },
  { title: '售后服务', items: ['售后政策', '退换说明', '取消订单'] },
  { title: '服务热线', items: ['客服电话 400-0000-000', '人工客服 周一至周日8：00-18：00', { text: 'AI客服', link: '#' }] }
])

// 轮播图方法
const goToSlide = (index) => {
  currentIndex.value = index
}

const startAutoPlay = () => {
  autoPlayTimer = setInterval(() => {
    if (currentIndex.value < bannerImages.value.length - 1) {
      currentIndex.value++
    } else {
      currentIndex.value = 0
    }
  }, 3000)
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

// 搜索框文字轮换
const startPlaceholderRotation = () => {
  placeholderTimer = setInterval(() => {
    currentPlaceholderIndex.value = (currentPlaceholderIndex.value + 1) % placeholderTexts.length
    currentPlaceholder.value = placeholderTexts[currentPlaceholderIndex.value]
  }, 3000)
}

onMounted(() => {
  startAutoPlay()
  startPlaceholderRotation()
})

onUnmounted(() => {
  stopAutoPlay()
  if (placeholderTimer) {
    clearInterval(placeholderTimer)
  }
})
</script>

<style scoped>
/* 版心 */
.wrapper {
  margin: 0 auto;
  width: 1240px;
}

/* 快捷导航 */
.shortcut {
  height: 52px;
  background-color: #333;
}

.shortcut .wrapper {
  display: flex;
  justify-content: flex-end;
  height: 52px;
}

.shortcut ul {
  display: flex;
  line-height: 52px;
}

.shortcut li a {
  padding: 0 15px;
  border-right: 1px solid #999;
  font-size: 14px;
  color: #fff;
}

.shortcut li:last-child a {
  border-right: 0;
}

.shortcut li .iconfont {
  margin-right: 4px;
  vertical-align: middle;
}

/* 头部 */
.header {
  display: flex;
  margin-top: 22px;
  margin-bottom: 22px;
  height: 69px;
}

/* logo */
.logo {
  margin-right: 100px;
  width: 200px;
  height: 69px;
}

.logo a {
  display: flex;
  width: 230px;
  height: 69px;
  background-image: url("@/assets/yigou.png");
  background-size: contain;
  background-repeat: no-repeat;
  font-size: 0;
}

/* 搜索区域 */
.search {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 23px;
  margin-right: 60px;
  width: 800px;
  height: 34px;
  border-bottom: 2px solid #f4f4f4;
}

.search .iconfont {
  font-size: 18px;
  color: #ccc;
}

.search input {
  flex: 1;
  width: 0;
  padding-left: 10px;
  border: none;
  outline: none;
  background: transparent;
}

.search input::placeholder {
  font-size: 16px;
  color: #ccc;
}

.search .search-placeholder {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
  z-index: 1;
  display: flex;
  align-items: center;
}

.search .placeholder-text {
  display: inline-block;
  animation: fadeInOut 0.5s ease-in-out;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-5px); }
  50% { opacity: 1; transform: translateY(0); }
  100% { opacity: 1; transform: translateY(0); }
}

/* 购物车 */
.cart {
  margin-top: 27px;
}

.cart a {
  color: #333;
}

/* banner */
.banner {
  height: 500px;
  background-color: #f5f5f5;
}

.banner .wrapper {
  position: relative;
  overflow: hidden;
  width: 1240px;
  height: 500px;
  padding: 0;
  margin: 0 auto;
}

/* 图片 */
.banner .pic {
  display: flex;
  margin: 0;
  padding: 0;
  margin-left: 250px;
  transition: transform 0.5s ease-in-out;
  list-style: none;
}

.banner .pic li {
  width: 990px;
  height: 500px;
  flex-shrink: 0;
}

.banner .pic img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* 侧导航 */
.subnav {
  position: absolute;
  left: 0;
  top: 0;
  width: 250px;
  height: 500px;
  background-color: #3f3e3e;
  z-index: 999;
  padding-top: 20px;
}

.subnav .left ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.subnav li {
  display: flex;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 20px;
  line-height: 36px;
  cursor: pointer;
}

.subnav li a {
  color: #fff;
  font-size: 16px;
  text-decoration: none;
}

.subnav p {
  padding-left: 30px;
  padding-right: 10px;
  color: #999;
  cursor: pointer;
  font-size: 12px;
  line-height: 20px;
  margin-bottom: 5px;
}

.subnav li span {
  color: #fff;
  font-size: 12px;
}

.subnav li:hover {
  background-color: rgba(0, 0, 0, 0.60);
}

.subnav p:hover {
  background-color: rgba(0, 0, 0, 0.50);
}

/* 指示器 */
.banner ol {
  display: flex;
  position: absolute;
  bottom: 20px;
  right: 16px;
  cursor: pointer;
  list-style: none;
  padding: 0;
  margin: 0;
}

.banner ol li {
  margin-left: 8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
}

.banner ol i {
  display: block;
  margin: 4px;
  width: 14px;
  height: 14px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50px;
}

/* 选中状态 */
.banner ol li.active i {
  background-color: #fff;
}

/* 上新标题 */
.title {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 30px;
  height: 42px;
}

.title .left {
  display: flex;
}

.title .left h3 {
  margin-right: 35px;
  font-size: 30px;
  font-weight: 400;
}

.title .left p {
  align-self: flex-end;
  color: #A1A1A1;
}

.title .right .more {
  line-height: 42px;
  color: #A1A1A1;
  text-decoration: none;
}

.title .right .more .iconfont {
  margin-left: 10px;
}

/* 商品列表 */
.bd ul {
  display: flex;
  gap: 20px;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.bd li {
  width: 290px;
  height: 400px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
}

.bd li a {
  text-decoration: none;
  color: #333;
}

.bd li .pic {
  width: 290px;
  height: 290px;
  overflow: hidden;
}

.bd li .pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.bd li:hover .pic img {
  transform: scale(1.05);
}

.bd li .txt {
  text-align: center;
  padding: 10px;
}

.bd li h4 {
  margin-top: 10px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bd li p {
  color: #e4393c;
  font-size: 16px;
  font-weight: bold;
}

/* 底部 */
.footer {
  margin-top: 60px;
  height: 580px;
  background-color: #f5f5f5;
}

/* 服务 */
.service {
  padding: 60px 0;
  height: 178px;
  border-bottom: 1px solid #e8e8e8;
}

.service ul {
  display: flex;
  justify-content: space-evenly;
  list-style: none;
  padding: 0;
  margin: 0;
}

.service li {
  display: flex;
  width: 190px;
  height: 58px;
}

.service li h5 {
  margin-right: 20px;
  width: 58px;
  height: 58px;
  background-image: url("@/assets/images/sprite.png");
  background-repeat: no-repeat;
}

.service li h5.service-icon-2 {
  background-position: 0 -58px;
}

.service li h5.service-icon-3 {
  background-position: 0 -116px;
}

.service li h5.service-icon-4 {
  background-position: 0 -174px;
}

.service li p {
  font-size: 28px;
  line-height: 58px;
}

/* 帮助中心 */
.help {
  display: flex;
  height: 300px;
  justify-content: space-between;
  padding-top: 60px;
}

.help .left {
  display: flex;
}

.help .left dl {
  margin-right: 84px;
}

.help .left dl:last-child {
  margin-right: 0;
}

.help .left dt {
  margin-bottom: 30px;
  font-size: 18px;
}

.help .left dd {
  margin-bottom: 10px;
  color: #969696;
}

.help .left dd a {
  color: #969696;
  text-decoration: none;
}

/* right */
.help .right ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.help .right li:first-child {
  margin-right: 55px;
}

.help .right .pic {
  width: 120px;
  height: 120px;
  margin-bottom: 10px;
}

.help .right .pic img {
  width: 100%;
  height: 100%;
}

.help .right p {
  text-align: center;
  color: #969696;
}

/* 版权 */
.copyright {
  text-align: center;
}

.copyright p {
  margin-bottom: 10px;
}

.copyright p a {
  margin: 0 10px;
  color: #969696;
  text-decoration: none;
}
</style>
