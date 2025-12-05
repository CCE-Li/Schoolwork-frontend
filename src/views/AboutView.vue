<template>
  <div class="about">
    <div class="about-container">
      <h1>关于我们</h1>
      <p class="description">易购图书商城是一个专业的在线图书购物平台，致力于为读者提供优质的阅读体验。</p>
      <div class="features">
        <div class="feature-item">
          <h3>品质保障</h3>
          <p>所有图书均为正版，品质有保证</p>
        </div>
        <div class="feature-item">
          <h3>快速配送</h3>
          <p>全国范围内快速配送，让您尽快收到心仪的图书</p>
        </div>
        <div class="feature-item">
          <h3>贴心服务</h3>
          <p>专业客服团队，为您提供全方位的购物支持</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f5f5f5;
}

.about-container {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
  line-height: 1.8;
}

.features {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.feature-item {
  flex: 1;
  max-width: 250px;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.feature-item h3 {
  font-size: 1.3rem;
  color: #42b983;
  margin-bottom: 1rem;
}

.feature-item p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .about {
    padding: 1.5rem;
  }

  h1 {
    font-size: 2rem;
  }

  .description {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .features {
    flex-direction: column;
    align-items: center;
  }

  .feature-item {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.6rem;
  }

  .feature-item {
    padding: 1.5rem;
  }

  .feature-item h3 {
    font-size: 1.1rem;
  }
}
</style>
