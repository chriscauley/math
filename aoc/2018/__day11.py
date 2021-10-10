# import numpy
# serial = int(7511)

# def power(x, y):
#     rack = (x + 1) + 10
#     power = rack * (y + 1)
#     power += serial
#     power *= rack
#     return (power // 100 % 10) - 5

# grid = numpy.fromfunction(power, (300, 300))

# for width in range(3, 300):
#     windows = sum(grid[x:x-width+1 or None, y:y-width+1 or None] for x in range(width) for y in range(width))
#     maximum = int(windows.max())
#     location = numpy.where(windows == maximum)
#     print(width, maximum, location[0][0] + 1, location[1][0] + 1)

import collections
import re

ser = 7315

d = {}
for i in xrange(1, 301):
  for j in xrange(1, 301):
    rack_id = i + 10
    then = (rack_id * j + ser) * rack_id
    powr = ((then // 100) % 10) - 5
    d[(i,j)] = powr


m = -100
mxy = 0
for i in xrange(1, 301):
  for j in xrange(1, 301):
    k = d[(i, j)]
    if k > m:
      m = k
      mxy = (i, j)
print mxy


# cs[(x, y)] is the cumulative sum of d[(i, j)] for all i <= x and j <= y
cs = {}
for i in xrange(1, 301):
  for j in xrange(1, 301):
    cs[(i, j)] = d[(i, j)] + cs.get((i - 1, j), 0) + cs.get((i, j - 1), 0) - cs.get((i - 1, j - 1), 0)
m = -100
mxy = 0
for i in xrange(1, 301):
  for j in xrange(1, 301):
    for s in xrange(1, 301 - max(i, j)):
      # I figured out after submitting that these indices should all be one
      # smaller since the bounds of the square are
      # i <= x < i + s, j <= y < j + s
      k = cs[(i + s, j + s)] + cs[(i, j)] - cs[(i + s, j)] - cs[(i, j + s)]
      if k > m:
        m = k
        mxy = (i, j, s)

print m, mxy