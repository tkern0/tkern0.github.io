import re

START = 0
END = 20000
SCALE_START = 12500
W = 768
H = 432
CW = W/2
CH = H/2

s = 1

output = open("_out", "w")
output.write("Time: {}, {}\n".format(START, SCALE_START))
output.write("RectFull: -1, #000000, {}, {}, {}, {}\n".format(int(CW-(CW*s)), int(CH-(CH*s)), int(2*CW*s), int(2*CH*s)))
output.write("Line: 0, #00FF00, {}, {}, {}, {}\n".format(int(CW-(CW*s)), int(CH), int(CW-(W*s/8)), int(CH)))
output.write("Line: 0, #00FF00, {}, {}, {}, {}\n".format(int(CW-(W*s/8)), int(CH), int(CW-(W*s/16)), int(CH-(H*s/4))))
output.write("Line: 0, #00FF00, {}, {}, {}, {}\n".format(int(CW-(W*s/16)), int(CH-(H*s/4)), int(CW+(W*s/16)), int(CH+(H*s/4))))
output.write("Line: 0, #00FF00, {}, {}, {}, {}\n".format(int(CW+(W*s/16)), int(CH+(H*s/4)), int(CW+(W*s/8)), int(CH)))
output.write("Line: 0, #00FF00, {}, {}, {}, {}\n".format(int(CW+(W*s/8)), int(CH), int(CW+(CW*s)), int(CH)))

START = 400

refresh_time = 1000
frame_time = 33
for i in range(START, END, refresh_time):
    if i + refresh_time < END:
        for time in range(i, i + refresh_time, frame_time):
            output.write("Time: {}, {}\n".format(time, time + frame_time))
            if time >= SCALE_START:
                s = 1 - ((time - SCALE_START) / (END - SCALE_START))
                output.write("RectFull: -1, #000000, {}, {}, {}, {}\n".format(int(CW-(CW*s)), int(CH-(CH*s)), int(2*CW*s), int(2*CH*s)))
                output.write("Line: 0, #00FF00, {}, {}, {}, {}\n".format(int(CW-(CW*s)), int(CH), int(CW-(W*s/8)), int(CH)))
                output.write("Line: 0, #00FF00, {}, {}, {}, {}\n".format(int(CW-(W*s/8)), int(CH), int(CW-(W*s/16)), int(CH-(H*s/4))))
                output.write("Line: 0, #00FF00, {}, {}, {}, {}\n".format(int(CW-(W*s/16)), int(CH-(H*s/4)), int(CW+(W*s/16)), int(CH+(H*s/4))))
                output.write("Line: 0, #00FF00, {}, {}, {}, {}\n".format(int(CW+(W*s/16)), int(CH+(H*s/4)), int(CW+(W*s/8)), int(CH)))
                output.write("Line: 0, #00FF00, {}, {}, {}, {}\n".format(int(CW+(W*s/8)), int(CH), int(CW+(CW*s)), int(CH)))
            pos = CW - int(((time - i) / refresh_time) * (W + 200) - 100)
            x, y, bw, bh = int(CW-(pos*s)), int(CH-(CH*s)), int(75*s), int(2*CH*s)
            if not (x + bw < int(CW-(CW*s)) or x >= int(CW+(CW*s))):
                if x < int(CW-(CW*s)):
                    bw = x + bw - int(CW-(CW*s))
                    x = int(CW-(CW*s))
                elif x + bw >= int(CW+(CW*s)):
                    bw = bw - (x + bw - int(CW+(CW*s)))
                output.write("RectFull: 1, #000000, {}, {}, {}, {}\n".format(x, y, bw, bh))

output.close()

text = re.sub(r"^(time: ?-?\d*?, ?-?\d*?\s+)(time: ?-?\d*?, ?-?\d*?\s+)+", r"\2", open("_out").read(), flags=re.M|re.I)
output = open("_out", "w").write(text)