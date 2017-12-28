"use strict"
const child_process = require("child_process")

function testOutput(cmd, expected) {
    it("Global state sharing: " + cmd, done => {
        const output = child_process.exec(
            "node -e '" + cmd + "'",
            { cwd: __dirname },
            (e, stdout, stderr) => {
                if (e) done.fail(e)
                else {
                    expect(stdout.toString()).toBe("")
                    expect(stderr.toString()).toBe(expected)
                    done()
                }
            }
        )
    })
}

describe("it should handle multiple instances with the correct warnings", () => {
    testOutput(
        'require("../../");require("../../lib/mobx.umd.js")',
        "[mobx] Warning: there are multiple mobx instances active. This might lead to unexpected results. See https://github.com/mobxjs/mobx/issues/1082 for details.\n"
    )
    testOutput(
        'require("../../").extras.shareGlobalState();require("../../lib/mobx.umd.js")',
        "[mobx] Deprecated: Using `shareGlobalState` is not recommended, use peer dependencies instead. See https://github.com/mobxjs/mobx/issues/1082 for details." +
            "\n[mobx] Warning: there are multiple mobx instances active. This might lead to unexpected results. See https://github.com/mobxjs/mobx/issues/1082 for details.\n"
    )
    testOutput(
        'require("../../").extras.shareGlobalState();require("../../lib/mobx.umd.js").extras.shareGlobalState()',
        "[mobx] Deprecated: Using `shareGlobalState` is not recommended, use peer dependencies instead. See https://github.com/mobxjs/mobx/issues/1082 for details." +
            "\n[mobx] Deprecated: Using `shareGlobalState` is not recommended, use peer dependencies instead. See https://github.com/mobxjs/mobx/issues/1082 for details.\n"
    )
    testOutput(
        'require("../../").extras.isolateGlobalState();require("../../lib/mobx.umd.js").extras.isolateGlobalState()',
        ""
    )
    testOutput('require("../../");require("../../lib/mobx.umd.js").extras.isolateGlobalState()', "")
    testOutput('require("../../").extras.isolateGlobalState();require("../../lib/mobx.umd.js")', "")
})
