const std = @import("std");
const Allocator = std.mem.Allocator;
const Parser = @import("parser.zig").Parser;
const Error = @import("parser.zig").Error;

pub fn Literal(comptime Reader: type) type {
    return struct {
        parser: Parser([]u8, Reader) = .{
            ._parse = parse,
        },
        want: []const u8,

        const Self = @This();

        pub fn init(want: []const u8) Self {
            return Self{
                .want = want
            };
        }

        fn parse(parser: *Parser([]u8, Reader), allocator: *Allocator, src: *Reader) callconv(.Inline) Error!?[]u8 {
            const self = @fieldParentPtr(Self, "parser", parser);

            const buf = try allocator.alloc(u8, self.want.len);
            const read = try src.reader().readAll(buf);

            if (read < self.want.len or !std.mem.eql(u8, buf, self.want)) {
                try src.seekableStream().seekBy(-@intCast(i64, read));

                allocator.free(buf);

                return null;
            }

            return buf;
        }
    };
}

test "Literal" {
    var allocator = std.testing.allocator;
    var reader = std.io.fixedBufferStream("abcdef");

    var literal = Literal(@TypeOf(reader)).init("abc");
    const p = &literal.parser;

    var result = try p.parse(&allocator, &reader);
      
    try std.testing.expectEqualStrings("abc", result.?);

    if (result) |r| {
        allocator.free(r);
    }
}