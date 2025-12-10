<template>
  <div class="after-sales-policy-page">
    <!-- 顶部导航 -->
    <header class="page-header">
      <div class="header-content">
        <div class="header-left">
          <el-button text @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h1>售后政策</h1>
        </div>
      </div>
    </header>

    <!-- 主体内容 -->
    <main class="page-main">
      <div class="policy-container">
        <el-card class="policy-card">
          <template #header>
            <div class="card-header">
              <el-icon class="header-icon"><Document /></el-icon>
              <span>售后服务政策说明</span>
            </div>
          </template>
          
          <div class="policy-content">
            <el-alert
              title="温馨提示"
              type="info"
              description="为了保障您的合法权益，请在申请售后服务前仔细阅读以下政策条款。如有疑问，请联系我们的客服人员。"
              show-icon
              class="policy-tip"
            />
            
            <div class="policy-section">
              <h2><el-icon><InfoFilled /></el-icon> 售后服务承诺</h2>
              <p>我们致力于为您提供优质的购物体验，特制定如下售后服务承诺：</p>
              <ul>
                <li>正品保证：所售商品均为正规渠道采购，确保正品</li>
                <li>七天无理由退货：自签收商品之日起7天内可申请无理由退货</li>
                <li>质量问题退换货：商品出现质量问题可享受免费退换货服务</li>
                <li>快速响应：客服将在24小时内对您的售后申请进行处理</li>
                <li>全程跟踪：提供售后进度实时查询服务</li>
              </ul>
            </div>
            
            <div class="policy-section">
              <h2><el-icon><Refresh /></el-icon> 退换货政策</h2>
              <h3>退货条件</h3>
              <ul>
                <li>自签收商品之日起7天内可申请退货</li>
                <li>商品保持原始包装及配件齐全</li>
                <li>不影响二次销售（未污损、未洗涤、未剪裁等）</li>
                <li>附有购买凭证及相关单据</li>
              </ul>
              
              <h3>换货条件</h3>
              <ul>
                <li>因商品质量问题导致无法正常使用</li>
                <li>收到的商品与订单不符</li>
                <li>商品存在破损、污渍等外观问题</li>
              </ul>
              
              <h3>不予退换货的情况</h3>
              <ul>
                <li>超过退换货时限的商品</li>
                <li>人为损坏或不当使用造成的质量问题</li>
                <li>无购买凭证或单据不齐全</li>
                <li>个性化定制商品（特殊标注除外）</li>
                <li>影响二次销售的商品</li>
              </ul>
            </div>
            
            <div class="policy-section">
              <h2><el-icon><Wallet /></el-icon> 退款说明</h2>
              <h3>退款方式</h3>
              <p>根据您的支付方式，退款将按以下方式处理：</p>
              <ul>
                <li>支付宝/微信支付：原路退回至支付账户，1-3个工作日到账</li>
                <li>银行卡支付：退回至原支付银行卡，3-7个工作日到账</li>
                <li>余额支付：退回至账户余额，即时到账</li>
              </ul>
              
              <h3>退款时效</h3>
              <ul>
                <li>审核通过后1-3个工作日内完成退款</li>
                <li>节假日顺延，具体以银行到账时间为准</li>
              </ul>
            </div>
            
            <div class="policy-section">
              <h2><el-icon><Truck /></el-icon> 返修政策</h2>
              <p>对于需要返修的商品，请按照以下流程操作：</p>
              <ol>
                <li>联系客服申请返修服务</li>
                <li>客服确认后提供返修地址</li>
                <li>将商品寄送至指定维修点</li>
                <li>维修完成后寄回给您</li>
              </ol>
              <p class="note">注：返修产生的运费由责任方承担，若因商品质量问题导致的返修，运费由我们承担。</p>
            </div>
            
            <div class="policy-section">
              <h2><el-icon><Service /></el-icon> 售后服务流程</h2>
              <div class="process-steps">
                <el-steps :active="5" finish-status="success" align-center>
                  <el-step title="提交申请" description="在线提交售后申请"></el-step>
                  <el-step title="客服审核" description="客服将在24小时内审核"></el-step>
                  <el-step title="寄回商品" description="按指引寄回相关商品"></el-step>
                  <el-step title="处理中" description="仓库接收并处理商品"></el-step>
                  <el-step title="完成" description="退款或换货完成"></el-step>
                </el-steps>
              </div>
            </div>
            
            <div class="policy-section">
              <h2><el-icon><Phone /></el-icon> 联系我们</h2>
              <div class="contact-info">
                <el-row :gutter="20">
                  <el-col :span="12" :xs="24">
                    <div class="contact-item">
                      <h4>客服热线</h4>
                      <p>400-0000-000</p>
                      <p class="time">(周一至周日 8:00-18:00)</p>
                    </div>
                  </el-col>
                  <el-col :span="12" :xs="24">
                    <div class="contact-item">
                      <h4>在线客服</h4>
                      <p>通过网站或APP在线咨询</p>
                      <p class="time">(周一至周日 8:00-22:00)</p>
                    </div>
                  </el-col>
                </el-row>
                
                <div class="contact-item">
                  <h4>电子邮件</h4>
                  <p>service@yigou.com</p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        
        <div class="policy-actions">
          <el-button type="primary" @click="goToOrders">查看我的订单</el-button>
          <el-button @click="goToShop">继续购物</el-button>
          <el-button type="success" @click="contactService">联系客服</el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  Document, 
  InfoFilled, 
  Refresh, 
  Wallet, 
  Truck, 
  Service, 
  Phone 
} from '@element-plus/icons-vue'

const router = useRouter()

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 跳转到订单页面
const goToOrders = () => {
  router.push('/user/orders')
}

// 跳转到商店
const goToShop = () => {
  router.push('/shop')
}

// 联系客服
const contactService = () => {
  ElMessage.info('正在为您连接客服...')
  // 实际项目中这里可以集成在线客服系统
}
</script>

<style scoped>
.after-sales-policy-page {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  overflow: hidden;
}

/* 头部 */
.page-header {
  flex-shrink: 0;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

/* 主体 */
.page-main {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.policy-container {
  max-width: 1000px;
  margin: 0 auto;
}

.policy-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.header-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #409eff;
}

.policy-content {
  padding: 20px 0;
}

.policy-tip {
  margin-bottom: 30px;
}

.policy-section {
  margin-bottom: 30px;
}

.policy-section:last-child {
  margin-bottom: 0;
}

.policy-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 20px 0 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.policy-section h2 .el-icon {
  color: #409eff;
}

.policy-section h3 {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  margin: 15px 0 10px;
}

.policy-section p {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 10px;
}

.policy-section ul,
.policy-section ol {
  padding-left: 20px;
  margin: 10px 0;
}

.policy-section li {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 8px;
}

.note {
  font-size: 13px;
  color: #909399;
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.process-steps {
  margin: 20px 0;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.contact-info {
  margin-top: 20px;
}

.contact-item {
  margin-bottom: 20px;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-item h4 {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.contact-item p {
  font-size: 14px;
  color: #606266;
  margin: 5px 0;
}

.contact-item .time {
  font-size: 13px;
  color: #909399;
}

.policy-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
}

.policy-actions .el-button {
  min-width: 120px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 12px 16px;
  }
  
  .page-main {
    padding: 16px;
  }
  
  .policy-container {
    padding: 0;
  }
  
  .policy-section h2 {
    font-size: 16px;
  }
  
  .policy-section h3 {
    font-size: 15px;
  }
  
  .policy-section p,
  .policy-section li {
    font-size: 13px;
  }
  
  .policy-actions {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .policy-actions .el-button {
    width: 100%;
    max-width: 300px;
  }
  
  .contact-item {
    text-align: center;
  }
}
</style>