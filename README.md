# Qifeng(Eli) Liang Personal Website

这是 Qifeng(Eli) Liang 个人网站的第一版。网站把专业、明亮的学术主页和沉浸式旅行地球结合在一个响应式单页应用中。

## Live Site

- Website: <https://eliang6033.github.io/>
- Version: `v0.1 Preview`

## 已实现内容

- Sticky 导航、Hero、About、Projects、Journey Preview、Hobbies、Contact 和 Footer
- 使用 `react-globe.gl` 与 Three.js 的全屏 3D 旅行地球
- 13 个已访问国家的高亮状态、重要程度图例与详情面板
- 拖动旋转、滚轮或双指缩放、自动旋转与交互后恢复
- Escape 和返回按钮退出旅行模式，并恢复原来的页面位置
- 桌面端右侧国家详情面板、移动端底部抽屉
- 在浏览器空闲、Journey Preview 接近视口或入口获得 hover/focus 时预加载旅行资源，但不会提前创建 WebGL 场景
- 键盘焦点、清晰焦点样式、语义化结构和减少动画偏好支持
- 本地国家边界数据，不依赖运行时第三方接口或 API Key

## 技术栈

- React 18
- Vite 5
- TypeScript
- Tailwind CSS
- Framer Motion
- react-globe.gl
- Three.js
- Lucide React

当前项目使用 Vite 5，以兼容本机的 Node.js 18。

## 安装与运行

```bash
npm install
npm run dev
```

开发服务器默认地址：

```text
http://127.0.0.1:5173/
```

构建与代码检查：

```bash
npm run lint
npm run build
```

预览 production build：

```bash
npm run preview
```

## 最常修改的文件

所有主要可见文字都集中在 `src/config` 或 `src/data`。通常不需要修改组件。

| 需要修改的内容 | 文件 |
| --- | --- |
| 页面标题、导航、姓名、介绍、按钮、About、Contact、Footer、状态提示 | `src/config/siteContent.ts` |
| GitHub、LinkedIn、Email、Resume 链接 | `src/config/siteContent.ts` 中的 `socialLinks` |
| Projects 标题、类别、介绍和 tags | `src/data/projects.ts` |
| Hobbies 标题和介绍 | `src/data/hobbies.ts` |
| 旅行统计、国家、城市、年份和详情 | `src/data/travel.ts` |
| 网站主色 | `src/config/siteContent.ts` 中的 `themeTokens` |
| 布局、间距和响应式样式 | `src/styles/globals.css` |
| 社交分享预览图 | `public/og-v2.png` |

### 需要优先替换的占位内容

打开 `src/config/siteContent.ts`，替换：

```text
YOUR_RESUME_URL
```

在替换前，这些项目会显示为明确的占位状态，不会伪装成真实可用链接。

## 如何修改个人文字

网站的主要文字已经集中到 `src/config` 和 `src/data`，通常不需要修改组件文件。

1. 打开 `src/config/siteContent.ts`。
2. 按区域修改对应内容：
   - `seo`：浏览器标题和社交分享文字
   - `navigation`：品牌名称和导航名称
   - `hero`：姓名、学位、学校、个人介绍和按钮
   - `about`：个人介绍段落和统计信息
   - `projects`、`journeyPreview`、`hobbies`、`contact`：各区块标题与介绍
   - `footer`：Footer 文字
   - `journeyMode`：旅行模式中的按钮、提示和状态文字
3. 联系方式和个人主页链接在同一文件的 `socialLinks` 中修改。
4. 项目、爱好和旅行内容分别在以下文件中修改：
   - `src/data/projects.ts`
   - `src/data/hobbies.ts`
   - `src/data/travel.ts`

修改字符串时保留引号、逗号和对象结构。保存文件后，开发页面会自动刷新。

## 如何增加项目

打开 `src/data/projects.ts`，在 `projects` 数组中增加一个对象：

```ts
{
  title: "New Research Project",
  category: "Research",
  description: "A short description of the question, method, or goal.",
  tags: ["AI", "Robotics", "Planning"],
  detailLabel: "View research direction",
},
```

字段说明：

- `title`：项目名称
- `category`：项目类别
- `description`：一到两句话的项目介绍
- `tags`：建议填写 2–4 个简短关键词
- `detailLabel`：项目卡片的无障碍说明文字

项目卡片会根据数组内容自动生成，不需要修改 `Projects.tsx`。建议每个项目使用不同的 `title`。

## 如何增加一个国家

在 `src/data/travel.ts` 的 `travelLocations` 数组中增加一个对象：

```ts
{
  name: "Japan",
  isoCode: "JPN",
  status: "visited",
  importance: "visited",
  year: "2025",
  highlight: "A short highlight",
  cities: ["Tokyo"],
  description: "A short description.",
  image: "/images/travel/japan/tokyo-01.webp",
  coordinates: { lat: 36.2, lng: 138.25 },
}
```

注意：

1. `isoCode` 使用大写的 ISO 3166-1 三字母代码，地球依靠这个字段匹配国家。
2. `status` 可选 `visited`、`lived` 或 `current`，用于详情中的文字状态。
3. `importance` 决定地球颜色，可选 `home`、`extended-stay` 或 `visited`。
4. `year` 是必填字段；暂时不确定时可以填写 `Year to be added`。
5. `highlight`、`cities`、`description` 和 `image` 都是可选字段，不需要时可以省略。
6. `coordinates` 是点击国家后地球移动到的中心位置。
7. 如果国家总数、居住地数量或当前地点发生变化，同时更新同一文件中的 `travelStats`。

只增加旅行内容时不需要修改组件。国家名称和代码正确后，地球会使用现有边界数据匹配并高亮该国家。

国家边界来自 `world-atlas` 中的 Natural Earth 数据，并已生成到：

```text
public/data/countries.geojson
```

需要重新生成时运行：

```bash
npm run data:countries
```

## 如何增加城市

城市直接写在国家对象的可选 `cities` 数组中。例如：

```ts
{
  name: "Japan",
  // 其他国家字段……
  cities: ["Tokyo", "Kyoto", "Osaka"],
}
```

当前版本只在国家详情中显示城市名称，不实现州、省或城市地图。

## 图片应该放在哪里

网站图片统一放在 `public/images` 中。需要时可以按用途新建以下目录：

```text
public/
├── images/
│   ├── profile/       头像和个人照片
│   ├── projects/      项目封面和研究图片
│   ├── travel/        国家、州、省和城市照片
│   └── hobbies/       爱好照片
├── og-v2.png          当前社交分享预览图
└── data/              地图边界数据，不放普通照片
```

`public` 中的文件在代码里从 `/` 开始引用。例如：

```ts
const imagePath = "/images/travel/japan/tokyo-shibuya-01.webp";
```

旅行详情已经支持可选 `image` 字段。把图片放入 `public/images/travel` 后，只需在 `src/data/travel.ts` 的国家对象中加入路径；没有 `image` 时不会显示图片区域。项目卡片和爱好卡片目前仍没有图片字段。不要把个人内容图片放进 `src/components`。

## 推荐的图片格式、尺寸和文件命名方法

### 推荐格式

- 普通照片优先使用 `WebP`，画质和文件大小比较平衡。
- 需要透明背景的图片使用 `PNG`。
- 社交分享图优先使用 `PNG` 或高质量 `JPG`。
- 不建议直接使用 `HEIC`、`TIFF` 或未经压缩的超大原图。
- 建议单张网页图片控制在 500 KB 以内；大幅背景图尽量控制在 1 MB 以内。

### 推荐尺寸

| 用途 | 推荐尺寸 | 推荐比例 |
| --- | --- | --- |
| 头像或个人照片 | `1200 × 1500` | `4:5` |
| 项目封面 | `1600 × 1000` | `8:5` |
| 旅行照片 | `1600 × 1200` | `4:3` |
| 爱好照片 | `1200 × 800` | `3:2` |
| 社交分享预览图 | `1200 × 630` | 约 `1.91:1` |

同一类图片尽量保持一致的宽高比，避免卡片高度和裁切位置变化过大。

### 文件命名

使用小写英文、数字和连字符，不使用空格、括号或特殊符号。建议格式为：

```text
主题-地点或内容-序号.格式
```

示例：

```text
qifeng-profile-01.webp
safe-autonomous-systems-cover.webp
japan-tokyo-shibuya-01.webp
china-hainan-sanya-01.webp
mountain-biking-trail-01.webp
```

同一张图片替换时尽量保持文件名不变；如果需要保留多个版本，在末尾使用 `-01`、`-02` 或明确版本号。

## 主要目录

```text
src/
├── components/          页面区块
│   └── journey/         旅行模式与 3D 地球
├── config/              全站主要文案、链接、状态文字与颜色
├── data/                Projects、Hobbies、Travel 内容
├── hooks/               减少动画偏好
├── styles/              全局与响应式样式
├── types/               内容与旅行数据类型
└── utils/               链接占位判断
public/
└── data/
    └── countries.geojson
```

## 第一版暂未实现

- 州、省和城市级地图钻取
- 飞行轨迹、年份滑块
- 真实旅行照片与照片上传
- CMS、后端、数据库、登录
- 联系表单
- 音效和复杂粒子效果
- 独立项目详情页

## GitHub Pages deployment

公开网站：<https://eliang6033.github.io/>

仓库使用用户根域名，因此 Vite 的 `base` 设置为 `/`。每次向 `main` 分支推送后，`.github/workflows/deploy-pages.yml` 会自动执行 `npm ci`、lint 和 production build，再把 `dist` 构建结果发布到 GitHub Pages。`dist` 和 `node_modules` 都不会提交到仓库。
