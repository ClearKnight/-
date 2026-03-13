# 大学城美食地图 (University Town Gourmet Map) 🍱

一个专为西丽大学城学生设计的本地化美食指南与社区平台。

## 项目背景
在南科大、清华、北大、哈工大和深大西丽校区周边，聚集了大量美食。本项目旨在解决学生“吃什么”的决策难题，通过高密度的地图标注、真实的 UGC 评价（包括好评与吐槽）以及社区动态，打造一个懂大学生的美食地图。

## 核心功能
- 📍 **美食地图**：基于高德地图 API，覆盖五大校区周边的餐厅、食堂及路边摊。
- 🍛 **智能推荐**：支持按评分、价格过滤，并提供“今日随机”功能，拯救选择困难症。
- 💬 **学生论坛**：真实的社区动态，汇集了学长学姐们的实诚评价（好吃的安利，难吃的排雷）。
- 📸 **视觉体验**：美团风格 UI 设计，评价附带真实照片。
- 🛠️ **UGC 投稿**：支持学生自主添加新店及撰写评价。

## 技术栈
- **Frontend**: React 19, TypeScript, Vite
- **Map**: AMap (高德地图) JS API 2.0
- **UI**: Custom CSS (Meituan Style)

## 本地开发指南

1. **克隆项目**:
   ```bash
   git clone https://github.com/ClearKnight/-.git
   cd 大学城美食地图
   ```

2. **安装依赖**:
   ```bash
   npm install
   ```

3. **配置环境变量**:
   复制 `.env.example` 为 `.env`，并填入你的高德地图 Key：
   ```bash
   cp .env.example .env
   ```

4. **启动项目**:
   ```bash
   npm run dev
   ```

## 部署说明
本项目已适配 Vercel 部署。

### 方式 1：一键部署 (推荐)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FClearKnight%2F-&env=VITE_AMAP_KEY,VITE_AMAP_SECURITY_CODE)

点击上方按钮，系统会自动克隆仓库并在 Vercel 上创建新项目。

### 方式 2：手动部署
1. 在 Vercel 后台导入 GitHub 仓库。
2. 在 **Environment Variables** 中配置以下变量：
   - `VITE_AMAP_KEY`: `141fcdabe032ae93334074cfab19228f`
   - `VITE_AMAP_SECURITY_CODE`: `f2836844f50057c85bf2fe9e03a9df4d`
3. 点击 **Deploy** 即可上线。
