import dbConnect from "@/lib/db";
import PlatformContent from "@/models/PlatformContent";
import { getPlatformDefault } from "@/lib/platform-content-defaults";

function buildDefaultMap(keys = []) {
  return [...new Set(keys.filter(Boolean))].reduce((accumulator, key) => {
    accumulator[key] = getPlatformDefault(key);
    return accumulator;
  }, {});
}

export async function getPlatformContent(key) {
  if (!key) {
    return null;
  }

  try {
    await dbConnect();
    const entry = await PlatformContent.findOne({ key }).lean();
    return entry?.value ?? getPlatformDefault(key);
  } catch (error) {
    console.warn(`Falling back to default platform content for "${key}".`, error);
    return getPlatformDefault(key);
  }
}

export async function getPlatformContentMap(keys = []) {
  const uniqueKeys = [...new Set(keys.filter(Boolean))];
  if (!uniqueKeys.length) {
    return {};
  }

  try {
    await dbConnect();
    const entries = await PlatformContent.find({ key: { $in: uniqueKeys } }).lean();
    const byKey = new Map(entries.map((entry) => [entry.key, entry.value]));

    return uniqueKeys.reduce((accumulator, key) => {
      accumulator[key] = byKey.has(key) ? byKey.get(key) : getPlatformDefault(key);
      return accumulator;
    }, {});
  } catch (error) {
    console.warn("Falling back to default platform content map.", error);
    return buildDefaultMap(uniqueKeys);
  }
}
