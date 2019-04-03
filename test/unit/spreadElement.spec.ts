import { LuaLibImportKind, LuaTarget } from "../../src/CompilerOptions";
import * as util from "../util";

test.each([{ inp: [] }, { inp: [1, 2, 3] }, { inp: [1, "test", 3] }])(
    "Spread Element Push (%p)",
    ({ inp }) => {
        const result = util.transpileAndExecute(
            `return JSONStringify([].push(...${JSON.stringify(inp)}));`,
        );
        expect(result).toBe([].push(...inp));
    },
);

test("Spread Element Lua 5.1", () => {
    // Cant test functional because our VM doesn't run on 5.1
    const options = { luaTarget: LuaTarget.Lua51, luaLibImport: LuaLibImportKind.None };
    const lua = util.transpileString(`[].push(...${JSON.stringify([1, 2, 3])});`, options);
    expect(lua).toBe("__TS__ArrayPush({}, unpack({\n    1,\n    2,\n    3,\n}));");
});

test("Spread Element Lua 5.2", () => {
    const options = { luaTarget: LuaTarget.Lua52, luaLibImport: LuaLibImportKind.None };
    const lua = util.transpileString(`[...[0, 1, 2]]`, options);
    expect(lua).toBe("{table.unpack({\n    0,\n    1,\n    2,\n})};");
});

test("Spread Element Lua 5.3", () => {
    const options = { luaTarget: LuaTarget.Lua53, luaLibImport: LuaLibImportKind.None };
    const lua = util.transpileString(`[...[0, 1, 2]]`, options);
    expect(lua).toBe("{table.unpack({\n    0,\n    1,\n    2,\n})};");
});

test("Spread Element Lua JIT", () => {
    const options = { luaTarget: "JiT" as LuaTarget, luaLibImport: LuaLibImportKind.None };
    const lua = util.transpileString(`[...[0, 1, 2]]`, options);
    expect(lua).toBe("{unpack({\n    0,\n    1,\n    2,\n})};");
});
