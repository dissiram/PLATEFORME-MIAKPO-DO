import React, { useMemo, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Responsive, WidthProvider } from "react-grid-layout";
import debounce from "lodash.debounce";
import { Move, X, Palette, Camera, ImagePlus, Video, Link as LinkIcon, Text, Box } from "lucide-react";

// wrap Responsive to get automatic width
const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * Constants: tweak to taste
 */
const COLS = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };
const ROW_HEIGHT = 28; // pixels per grid row
const DEFAULT_COL_WIDTH = 120; // approximate px per column used to convert w -> px

/**
 * Helpers: convert from block.width/height (px) to grid w/h and back
 */
function pxToGridW(pxWidth, cols = COLS.lg, containerWidth = DEFAULT_COL_WIDTH * cols) {
  // approximate column width
  const colWidth = containerWidth / cols;
  return Math.max(1, Math.round(pxWidth / colWidth));
}

function pxToGridH(pxHeight) {
  return Math.max(1, Math.round(pxHeight / ROW_HEIGHT));
}

function gridWToPx(w, cols = COLS.lg, containerWidth = DEFAULT_COL_WIDTH * cols) {
  const colWidth = containerWidth / cols;
  return Math.max(100, Math.round(w * colWidth));
}

function gridHToPx(h) {
  return Math.max(80, Math.round(h * ROW_HEIGHT));
}

/**
 * BlockItem: rend un bloc selon son type.
 * Reçoit updateBlock, removeBlock, imageInputRef, videoInputRef pour actions.
 */
function BlockItem({ block, updateBlock, removeBlock, imageInputRef, videoInputRef }) {
  const onChangeContent = (value) => updateBlock(block.id, { content: value });
  const onChangeTitle = (title) => updateBlock(block.id, { title });

  return (
    <div
      className="w-full h-full flex flex-col bg-transparent overflow-hidden rounded-2xl"
      style={{ minHeight: 80 }}
      data-testid={`block-${block.id}`}
    >
      {/* header */}
      <div className="flex items-center justify-between px-3 py-2 bg-white/20 border-b border-white/10">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Move size={16} className="text-gray-500" />
          <input
            value={block.title || ""}
            onChange={(e) => onChangeTitle(e.target.value)}
            className="bg-transparent outline-none text-sm font-semibold max-w-[160px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            title="Couleur"
            className="p-1 rounded hover:bg-white/20"
            onClick={() => updateBlock(block.id, { showColorPicker: !block.showColorPicker })}
          >
            <Palette size={16} />
          </button>

          <button
            title="Supprimer"
            className="p-1 rounded hover:bg-red-100 text-gray-600"
            onClick={() => removeBlock(block.id)}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* main content */}
      <div className="p-3 flex-1 overflow-auto">
        {block.type === "text" && (
          <textarea
            value={block.content || ""}
            onChange={(e) => onChangeContent(e.target.value)}
            className="w-full h-full bg-transparent outline-none resize-none text-sm"
            placeholder="Saisissez votre texte..."
          />
        )}

        {block.type === "image" && (
          <div className="h-full w-full flex items-center justify-center">
            {!block.content ? (
              <button
                className="flex flex-col items-center gap-2 py-6 px-4 border border-dashed rounded-md hover:bg-gray-50"
                onClick={() => imageInputRef.current?.click()}
              >
                <ImagePlus size={24} />
                <span className="text-sm text-gray-500">Ajouter une image</span>
              </button>
            ) : (
              <div className="relative w-full h-full">
                <img src={block.content} alt={block.title} className="w-full h-full object-cover rounded" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <button className="p-2 bg-white rounded-full" onClick={() => imageInputRef.current?.click()}>
                    <Camera size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {block.type === "video" && (
          <div className="h-full w-full flex items-center justify-center">
            {!block.content ? (
              <button
                className="flex flex-col items-center gap-2 py-6 px-4 border border-dashed rounded-md hover:bg-gray-50"
                onClick={() => videoInputRef.current?.click()}
              >
                <Video size={24} />
                <span className="text-sm text-gray-500">Ajouter une vidéo</span>
              </button>
            ) : (
              <video src={block.content} controls className="w-full h-full rounded object-cover" />
            )}
          </div>
        )}

        {block.type === "link" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <LinkIcon size={18} className="text-blue-600" />
              <input
                value={block.content}
                onChange={(e) => onChangeContent(e.target.value)}
                className="flex-1 bg-transparent outline-none border-b border-blue-100 px-1 py-1"
                placeholder="https://votre-lien.com"
                type="url"
              />
            </div>
            {block.content && !/^https?:\/\//.test(block.content) && (
              <div className="text-xs text-red-400">Lien invalide — doit commencer par http:// ou https://</div>
            )}
          </div>
        )}

        {block.type === "section" && (
          <div className="flex flex-col gap-2">
            <input
              value={block.title}
              onChange={(e) => onChangeTitle(e.target.value)}
              className="font-bold text-sm bg-transparent outline-none"
              placeholder="Titre de la section"
            />
            <textarea
              value={block.content}
              onChange={(e) => onChangeContent(e.target.value)}
              className="w-full bg-transparent outline-none resize-none text-sm"
              placeholder="Contenu de la section..."
            />
          </div>
        )}
      </div>

      {/* footer: couleur (simple rendu) */}
      {block.color && (
        <div className="px-3 py-2 border-t text-xs text-gray-600">
          Couleur: <span className="font-mono">{block.color}</span>
        </div>
      )}
    </div>
  );
}

BlockItem.propTypes = {
  block: PropTypes.object.isRequired,
  updateBlock: PropTypes.func.isRequired,
  removeBlock: PropTypes.func.isRequired,
  imageInputRef: PropTypes.object,
  videoInputRef: PropTypes.object,
};

/**
 * BlockGrid principal
 *
 * Props:
 * - blocks: array of block objects { id, type, width, height, color, ... }
 * - updateBlock(id, updates)
 * - removeBlock(id)
 * - addBlock(type, content)
 * - imageInputRef, videoInputRef
 */
export default function BlockGrid({
  blocks,
  updateBlock,
  removeBlock,
  addBlock,
  imageInputRef,
  videoInputRef,
}) {
  const containerRef = useRef(null);

  // derive layout from blocks for react-grid-layout
  const layout = useMemo(() => {
    // We'll map block.width/height -> w/h based on DEFAULT_COL_WIDTH & ROW_HEIGHT
    // Use fixed cols=12 for lg breakpoint
    const containerWidth = (DEFAULT_COL_WIDTH * COLS.lg);
    return blocks.map((b, idx) => {
      const w = Math.max(1, Math.round((b.width || DEFAULT_COL_WIDTH) / (containerWidth / COLS.lg)));
      const h = Math.max(1, Math.round((b.height || 120) / ROW_HEIGHT));
      return {
        i: b.id.toString(),
        x: (idx * 2) % COLS.lg,
        y: Math.floor(idx / Math.floor(COLS.lg / 2)) * h, // simple stacking initial
        w,
        h,
        static: false,
      };
    });
  }, [blocks]);

  // Persist layout to localStorage: using debounce to avoid too many writes
  const persistLayout = useRef(debounce((nextLayout) => {
    // Map layout back to px sizes and update blocks
    nextLayout.forEach(item => {
      const found = blocks.find(b => b.id.toString() === item.i);
      if (!found) return;
      const widthPx = gridWToPx(item.w, COLS.lg, DEFAULT_COL_WIDTH * COLS.lg);
      const heightPx = gridHToPx(item.h);
      // Only update when there is a meaningful diff
      if (Math.abs((found.width || 0) - widthPx) > 4 || Math.abs((found.height || 0) - heightPx) > 4) {
        updateBlock(found.id, { width: widthPx, height: heightPx });
      }
    });
    // save order/positions
    try {
      localStorage.setItem("cv_layout", JSON.stringify(nextLayout));
    } catch (e) {
      // ignore
    }
  }, 250)).current;

  // handle layout change (drag/resize)
  const onLayoutChange = useCallback((currentLayout) => {
    persistLayout(currentLayout);
  }, [persistLayout]);

  // onDragStop: ensure final position/size persisted
  const onDragStop = useCallback((layout) => {
    persistLayout(layout);
  }, [persistLayout]);

  const onResizeStop = useCallback((layout) => {
    persistLayout(layout);
  }, [persistLayout]);

  // Provide breakpoints & cols for responsiveness
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };

  // Render each block inside a grid item
  return (
    <div ref={containerRef} className="w-full">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={breakpoints}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        measureBeforeMount={false}
        useCSSTransforms={true}
        isResizable
        isDraggable
        onLayoutChange={onLayoutChange}
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
        margin={[12, 12]}
        containerPadding={[0, 0]}
        draggableHandle=".react-grid-item, .drag-handle"
        // Compact type can be 'vertical' or null if you prefer absolute placement
        compactType="vertical"
      >
        {blocks.map((block) => {
          // find layout item for this block so we can set initial w/h for RGL
          const layoutItem = layout.find(l => l.i === block.id.toString());
          const w = layoutItem ? layoutItem.w : 3;
          const h = layoutItem ? layoutItem.h : Math.max(2, Math.round((block.height || 120) / ROW_HEIGHT));
          return (
            <div
              key={block.id.toString()}
              data-grid={{ i: block.id.toString(), x: layoutItem?.x || 0, y: layoutItem?.y || 0, w, h }}
              className="bg-transparent rounded-2xl overflow-hidden border border-gray-100"
              style={{ background: block.color || "transparent" }}
            >
              <div className="h-full group flex flex-col">
                <BlockItem
                  block={block}
                  updateBlock={updateBlock}
                  removeBlock={removeBlock}
                  imageInputRef={imageInputRef}
                  videoInputRef={videoInputRef}
                />
              </div>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
}

BlockGrid.propTypes = {
  blocks: PropTypes.array.isRequired,
  updateBlock: PropTypes.func.isRequired,
  removeBlock: PropTypes.func.isRequired,
  addBlock: PropTypes.func,
  imageInputRef: PropTypes.object,
  videoInputRef: PropTypes.object,
};
