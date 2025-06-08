const modules = import.meta.glob("./{exam,test}/*.json", { eager: true });

const questionMap = {};

for (const path in modules) {
  const keyMatch = path.match(/\/(exam|test)[-/](\d+)\.json$/);
  if (keyMatch) {
    const type = keyMatch[1];
    const number = keyMatch[2];
    questionMap[`${type}-${number}`] = modules[path].default;
  }
}

export default questionMap;
