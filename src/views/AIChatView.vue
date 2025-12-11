<template>
  <div class="ai-chat-container">
    <div class="chat-header">
      <el-button size="small" @click="goBack">返回上一步</el-button>
      <h2>AI 客服助手</h2>
    </div>

    <div ref="chatContainer" class="chat-messages">
      <div v-for="(message, index) in messages" :key="index"
           :class="['message', message.role]">
        <div class="message-avatar">
          <el-avatar :src="message.role === 'user' ? userAvatar : aiAvatar"></el-avatar>
        </div>
        <div class="message-content">
          <div class="message-role">{{ message.role === 'user' ? '你' : 'AI 助手' }}</div>
          <div class="message-text" v-html="renderMarkdown(message.content)"></div>
        </div>
      </div>
      <div v-if="isLoading" class="message assistant">
        <div class="message-avatar">
          <el-avatar :src="aiAvatar"></el-avatar>
        </div>
        <div class="message-content">
          <div class="message-role">AI 助手</div>
          <div class="message-text">
            <span v-html="renderMarkdown(currentResponse)"></span>
            <span class="typing-cursor">|</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-input-container">
      <el-input
        v-model="userInput"
        type="textarea"
        :rows="3"
        placeholder="请输入您的问题..."
        :disabled="isLoading"
        @keyup.enter.exact.prevent="sendMessage"
      ></el-input>

      <div class="preset-questions" v-if="presetQuestions && presetQuestions.length">
        <span class="preset-label">猜你想问：</span>
        <el-space wrap>
          <el-button
            v-for="(q, idx) in presetQuestions"
            :key="idx"
            size="small"
            @click="usePreset(q)"
          >
            {{ q }}
          </el-button>
        </el-space>
      </div>

      <div class="input-actions">
        <el-button
          type="primary"
          :loading="isLoading"
          @click="sendMessage"
          :disabled="!userInput.trim() || isLoading"
        >
          {{ isLoading ? '生成中...' : '发送' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import userAvatarImg from '@/assets/images/85932h181p0.webp'
import aiAvatarImg from '@/assets/images/eeb63d13e57c4e1ca73166fa66ac9ff4preview.jpeg~tplv-a9rns2rl98-downsize_watermark_1_5_b.png'

export default {
  name: 'AIChatView',
  data() {
    return {
      userInput: '',
      messages: [],
      isLoading: false,
      currentResponse: '',
      controller: null,
      userAvatar: userAvatarImg,
      aiAvatar: aiAvatarImg,
      presetQuestions: [
        '如何下单？可以一步一步教我吗？',
        '帮我查一下我最新一笔订单的状态。',
        '收到的书有破损/缺页，怎么申请换货？',
        '可以根据我最近买的书，给我推荐几本类似的书吗？'
      ],
      markdown: new MarkdownIt({
        linkify: true,
        breaks: true
      })
    };
  },
  mounted() {
    // 仅当从首页「在线客服」入口进入时，显示一条欢迎消息
    if (this.$route && this.$route.query && this.$route.query.from === 'shop') {
      this.messages.push({
        role: 'assistant',
        content: '你好，我是 AI 客服助手，可以帮你解答下单、订单、购物车等相关问题，有什么想了解的可以直接问我~'
      })
      this.scrollToBottom()
    }
  },

  methods: {
    goBack() {
      this.$router.back();
    },

    usePreset(question) {
      if (!question || this.isLoading) return;
      this.userInput = question;
      this.scrollToBottom();
    },

    renderMarkdown(content) {
      if (!content) return ''
      try {
        return this.markdown.render(content)
      } catch (e) {
        console.error('Markdown 渲染失败:', e)
        return content
      }
    },

    async sendMessage() {
      const message = this.userInput.trim();
      if (!message || this.isLoading) return;

      // 添加用户消息
      this.messages.push({
        role: 'user',
        content: message
      });

      this.scrollToBottom();

      // 清空输入框
      this.userInput = '';
      this.currentResponse = '';
      this.isLoading = true;

      try {
        // 创建新的 AbortController
        this.controller = new AbortController();

        const response = await fetch(`/api/ai/chat/stream?prompt=${encodeURIComponent(message)}`, {
          method: 'GET',
          signal: this.controller.signal,
          headers: {
            'Content-Type': 'text/event-stream',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            this.currentResponse += chunk;
            this.scrollToBottom();
          }
        }

        // 将完整的响应添加到消息历史
        this.messages.push({
          role: 'assistant',
          content: this.currentResponse
        });

      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error:', error);
          this.$message.error('请求失败: ' + error.message);
        }
      } finally {
        this.isLoading = false;
        this.currentResponse = '';
        this.scrollToBottom();
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.chatContainer;
        container.scrollTop = container.scrollHeight;
      });
    },

    stopGenerating() {
      if (this.controller) {
        this.controller.abort();
        this.isLoading = false;

        // 如果当前有部分响应，将其保存到消息历史
        if (this.currentResponse) {
          this.messages.push({
            role: 'assistant',
            content: this.currentResponse
          });
          this.currentResponse = '';
        }
      }
    }
  },

  beforeUnmount() {
    if (this.controller) {
      this.controller.abort();
    }
  }
};
</script>

<style scoped>
.ai-chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chat-header {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.5em;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.message {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-avatar {
  margin-right: 12px;
  flex-shrink: 0;
}

.message-content {
  max-width: 80%;
}

.message-role {
  font-weight: bold;
  margin-bottom: 4px;
  color: #666;
  font-size: 0.9em;
}

.message-text {
  background-color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  line-height: 1.6;
  word-wrap: break-word;
}

.message.user {
  flex-direction: row-reverse;
}

.message.user .message-content {
  margin-left: 0;
  margin-right: 12px;
  align-items: flex-end;
}

.message.user .message-text {
  background-color: #e3f2fd;
  color: #0d47a1;
}

.chat-input-container {
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.typing-cursor {
  display: inline-block;
  width: 10px;
  animation: blink 1s step-end infinite;
  color: #409EFF;
  font-weight: bold;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

/* 暗色模式适配 */
[data-theme-mode="dark"] .ai-chat-container,
[data-theme-mode="dark"] .chat-messages {
  background-color: #1e1e1e;
  color: #e0e0e0;
}

[data-theme-mode="dark"] .message-text {
  background-color: #2d2d2d;
  color: #e0e0e0;
}

[data-theme-mode="dark"] .message.user .message-text {
  background-color: #0d47a1;
  color: #e3f2fd;
}

[data-theme-mode="dark"] .chat-input-container {
  border-top-color: #444;
}

[data-theme-mode="dark"] .chat-header {
  border-bottom-color: #444;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .ai-chat-container {
    height: calc(100vh - 60px);
    padding: 10px;
  }

  .message-content {
    max-width: 75%;
  }
}
</style>
