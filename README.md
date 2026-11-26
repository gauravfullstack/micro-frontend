# Microfrontend E-commerce Demo

A beginner-friendly React + Vite example with three separately served applications. The **host** owns the page layout and cart state; the **products** and **cart** remotes own their respective UI features and are loaded at runtime with the official `@module-federation/vite` plugin.

## 1. Architecture in a minute

```text
                         ┌──────────────────────────────┐
                         │ Host / container :5000       │
                         │ Layout, navigation, cart data│
                         └───────────┬───────────┬──────┘
                                     │           │
                      loads ProductList     loads Cart
                                     │           │
                 ┌───────────────────▼─┐   ┌─────▼────────────────┐
                 │ Products remote     │   │ Cart remote          │
                 │ :5001               │   │ :5002                │
                 │ Exposes ProductList │   │ Exposes Cart         │
                 └─────────────────────┘   └──────────────────────┘
                       onAddToCart(product) → host state
                       host cartItems ───────────────→ Cart props
                       onRemoveItem(index) ←───────── Cart callback
```

- A **host** (also called a container) is the app users visit. It decides which remote features to load and provides the common shell.
- A **remote** is an independently built app that publishes one or more modules. It can run by itself as well as being loaded by a host.
- **Module Federation** lets separately built JavaScript applications share modules at runtime. The host resolves `products/ProductList` and `cart/Cart` to the remotes' `remoteEntry.js` files.
- The remotes expose components in `vite.config.js`; the host declares their URLs and imports them lazily. This is runtime loading, not source-code copying or an iframe.

## 2. Navigation and data flow

The host provides three simple hash routes: `#/home`, `#/products`, and `#/cart`. The navigation links change the browser hash, and the host listens for the browser's `hashchange` event to render the selected page. This is intentionally a small teaching example, not a replacement for a routing library in a larger application. The remotes own feature content; the host decides where that content appears.

1. The host renders `<ProductList onAddToCart={addToCart} />`.
2. The Products remote calls `onAddToCart(product)` when a button is clicked.
3. That callback updates the host's `cartItems` React state.
4. React renders the host again and passes the new array to `<Cart items={cartItems} />`.
5. The Cart remote displays the items and total. When Remove is clicked, it calls `onRemoveItem(index)`.
6. That callback updates the host's state, which passes the smaller list back to the Cart remote.

The host and remotes declare React and React DOM as **singletons**. This tells Module Federation to use one compatible copy on the page rather than loading a second React instance. Duplicate React copies can break Hooks and context. `react/` and `react-dom/` cover subpath imports such as the JSX runtime.

This is two-way communication through a simple contract: callbacks send user actions up to the host, and props send the resulting state down to a remote. The host remains the source of truth; neither remote imports the other's code or owns the shared cart. No refresh, Redux, or event bus is needed. Each remote also has a tiny standalone preview shell for local development.

## 3. Project structure

```text
Microfrontend-Ecommerce/
├── host/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── RemoteErrorBoundary.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── products/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductList.css
│   │   ├── main.jsx
│   │   └── products.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── cart/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Cart.jsx
│   │   ├── Cart.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── package.json
└── README.md
```

## 4. Install and run

Use Node.js 20.19+ (Node.js 22 LTS is recommended) and npm. From this directory:

```bash
npm install
```

Start each app in its own terminal:

```bash
npm run dev:host
npm run dev:products
npm run dev:cart
```

Open **http://localhost:5000**. The host expects the product and cart remotes at ports 5001 and 5002. The remotes are also independently viewable at **http://localhost:5001** and **http://localhost:5002**.

Build the three apps:

```bash
npm run build
```

For production preview, run `npm run preview --workspace products`, `npm run preview --workspace cart`, and `npm run preview --workspace host` in separate terminals. The host must still be able to fetch both remote entries.

## 5. Important files and federation configuration

### Remote `vite.config.js`

Each remote names itself (`products` or `cart`), emits `remoteEntry.js`, and maps an exposed module key to a local component:

```js
federation({
  name: "products",
  filename: "remoteEntry.js",
  exposes: { "./ProductList": "./src/ProductList.jsx" },
  shared: { /* React singleton dependencies */ },
});
```

`name` identifies the remote container; `filename` is the runtime entry the host downloads; `exposes` is the public module API; and `shared` coordinates libraries already present on the host. The Cart remote exposes `./Cart` in the same way.

### Host `vite.config.js`

The host config's `remotes` map connects import prefixes (`products` and `cart`) to remote entry URLs. `type: "module"` selects Vite's ESM remote format. `shared` makes React/React DOM singleton dependencies. `loadEnv` allows a deployment to override the local defaults with `VITE_PRODUCTS_REMOTE_ENTRY` and `VITE_CART_REMOTE_ENTRY`. `build.target: "chrome89"` selects a modern browser target for the federation ESM runtime.

### React components

`host/src/App.jsx` uses `React.lazy` and `Suspense` so each feature is loaded on demand, while independent error boundaries show a useful message if a remote is unavailable. The Products remote exposes only its reusable `ProductList`, and the Cart remote exposes only its reusable `Cart`; the standalone `App.jsx` files let developers open each remote directly.

## 6. Build and deploy independently

Build each workspace with `npm run build --workspace host`, `npm run build --workspace products`, or `npm run build --workspace cart`. Deploy each app's `dist/` output to its own static host. Publish the product and cart remote entries at stable, reachable URLs, then build the host with those URLs set:

```bash
# Example for a POSIX shell; set equivalent environment variables in your deployment platform.
VITE_PRODUCTS_REMOTE_ENTRY=https://cdn.example.com/products/remoteEntry.js \
VITE_CART_REMOTE_ENTRY=https://cdn.example.com/cart/remoteEntry.js \
npm run build --workspace host
```

The example's dev defaults use localhost; deployments must configure their real remote URLs and enable appropriate CORS headers on remote hosts. A team can update and deploy one remote independently, provided it maintains its exposed component's props contract and compatible shared dependencies. For fully independent rollouts, keep remote URLs stable or use a manifest/versioning strategy.

## 7. Test the complete flow

1. Run all three development servers and open the host on port 5000.
2. Use Home, Products, and Cart navigation; try the browser Back button. The URL hash should change without a full-page reload.
3. Add two products. The header count should update, and the Cart remote should show the items and total.
4. Remove one item in the Cart remote. The host-owned count and cart contents should update.
5. Open either remote's own port to confirm its standalone preview renders.
6. Stop one remote and reload the host. Its page should show an unavailable message while navigation and the other remote remain available.
7. Run `npm run build` to confirm all three production bundles build.

## 8. Interview preparation

### 1. What is Microfrontend Architecture?
- **Simple:** A frontend is split into smaller applications that can be developed and delivered independently, then composed into one user experience.
- **Here:** The host composes a product catalog and cart from two separately served React apps.
- **Interview answer:** “Microfrontends apply the independently owned and deployed idea of microservices to frontend features, while still presenting one coherent application to users.”

### 2. Why do we need Microfrontends?
- **Simple:** They help large teams work on clearly separated product areas without coordinating every frontend change in one release.
- **Here:** A catalog team could change the Products remote without rebuilding its source into the Cart remote.
- **Interview answer:** “I consider them when team and product scale create real ownership or deployment bottlenecks, not just to split a small app into more pieces.”

### 3. What problems do Microfrontends solve?
- **Simple:** They can reduce release coordination, clarify ownership, and allow teams to choose feature-specific implementation timelines.
- **Here:** Product listing and cart presentation have separate builds and expose small interfaces.
- **Interview answer:** “They address organizational coupling and release bottlenecks, but they do not automatically solve shared design, data, or operational concerns.”

### 4. Microfrontend vs. monolithic frontend?
- **Simple:** A monolith usually builds and releases the UI as one unit; microfrontends compose separately built feature apps at runtime or integration time.
- **Here:** Three Vite projects are run and built separately; the host downloads two remote entries.
- **Interview answer:** “A monolith is simpler to develop and operate; microfrontends trade that simplicity for independent ownership and deployment.”

### 5. What is Module Federation?
- **Simple:** A runtime mechanism for one JavaScript build to provide modules that another build can load, including coordination of shared packages.
- **Here:** Each remote exposes a component and the host imports it through the plugin's federation runtime.
- **Interview answer:** “Module Federation allows separately compiled applications to expose and consume modules at runtime without bundling all source into one build.”

### 6. What are Host and Remote applications?
- **Simple:** The host composes the page and declares remotes; each remote publishes modules for other apps to consume.
- **Here:** `host` is the container; `products` and `cart` publish `ProductList` and `Cart`.
- **Interview answer:** “The host controls composition, while remotes own features and expose a defined module contract.”

### 7. How do Microfrontends communicate?
- **Simple:** Prefer explicit, small contracts: props/callbacks for component composition, or events/APIs when apps do not share a component tree.
- **Here:** The product callback sends a product to host state; the host passes the resulting list into the cart component.
- **Interview answer:** “I keep communication explicit and minimize shared mutable state; here a callback and props are enough.”

### 8. How do we share dependencies?
- **Simple:** Federation can provide common libraries to consumers rather than duplicating each copy. Singleton sharing asks the runtime to use one instance.
- **Here:** All three apps declare React and React DOM as shared singletons.
- **Interview answer:** “I share stable, large dependencies selectively and check version compatibility; sharing everything can create hidden coupling.”

### 9. Can Microfrontends use different React versions?
- **Simple:** Sometimes, depending on federation/runtime configuration and isolation. But components rendered into one React tree generally need a compatible shared React instance.
- **Here:** This demo deliberately uses one React version as a singleton because remote components are rendered by the host.
- **Interview answer:** “Different versions are possible with careful isolation or separate roots, but I would not casually mix versions across a shared React tree.”

### 10. How does independent deployment work?
- **Simple:** A remote build is deployed to its own URL; the host points at that entry and loads it when needed.
- **Here:** The host's remote entry URLs can be changed with `VITE_PRODUCTS_REMOTE_ENTRY` and `VITE_CART_REMOTE_ENTRY`.
- **Interview answer:** “Independent deploys require stable remote locations, backward-compatible contracts, and a strategy for versioning and rollback.”

### 11. Advantages and disadvantages?
- **Simple:** Advantages include team autonomy and isolated releases; costs include more infrastructure, integration testing, duplicated downloads, and consistency challenges.
- **Here:** Each app has its own Vite config and build, but all three need running servers and compatible contracts.
- **Interview answer:** “Microfrontends improve organizational independence at the cost of runtime and operational complexity.”

### 12. What if a remote fails?
- **Simple:** The shell should remain useful and fail only the affected feature, with logging and an actionable fallback.
- **Here:** Each lazy remote has its own error boundary so Products failing does not hide Cart.
- **Interview answer:** “I isolate failures with boundaries or fallback UI, monitor the failure, and avoid making critical host navigation depend on optional remotes.”

### 13. What are the performance challenges?
- **Simple:** More apps can mean extra network requests, repeated dependencies, slower startup, and larger total JavaScript.
- **Here:** Lazy loading postpones the remote feature downloads, and shared singleton React avoids intentionally shipping a separate React for each remote.
- **Interview answer:** “I measure startup and interaction costs, lazy-load noncritical remotes, share dependencies carefully, and use caching/preloading where measurements justify it.”

### 14. When should we avoid Microfrontends?
- **Simple:** Avoid them when a small team or simple product can move quickly in one app; the added deployment and runtime complexity may outweigh autonomy.
- **Here:** This demo is intentionally small for learning. A real shop with one small team may be simpler as one Vite app.
- **Interview answer:** “I would choose microfrontends only when independent team ownership or release cadence is a concrete need, not as a default architecture.”

## Notes

This project is intentionally a learning demo: it has no backend, persistence, checkout, or production remote-discovery service. The cart exists in host memory and resets on page reload. The SVG product illustrations are inline data URLs so the demo does not depend on an external image service.
