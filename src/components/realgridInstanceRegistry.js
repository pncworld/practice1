/** Realgrid 인스턴스별 gridView / dataProvider (다중 그리드 화면 공용) */
export const rgInstanceRegistry = new Map();

export const rgGetInstance = (id) =>
  id ? rgInstanceRegistry.get(id) ?? null : null;

export const rgDestroyRegistryInstance = (id) => {
  if (!id) return;
  const inst = rgInstanceRegistry.get(id);
  if (!inst) return;
  try {
    inst.dataProvider?.clearRows?.();
    inst.dataProvider?.destroy?.();
  } catch (_) {
    void 0;
  }
  try {
    inst.gridView?.destroy?.();
  } catch (_) {
    void 0;
  }
  rgInstanceRegistry.delete(id);
};
