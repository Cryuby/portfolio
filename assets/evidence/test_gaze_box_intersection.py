"""Portfolio-only checks with synthetic inputs, not research evaluation results.

Save next to gaze_box_intersection.py and run:
    python test_gaze_box_intersection.py
Requirement: NumPy. No video, gaze records, model weights, or network access.
"""

import unittest

from gaze_box_intersection import point_box_intersect


class GazeBoxIntersectionTests(unittest.TestCase):
    def test_center_inside_box(self):
        self.assertTrue(point_box_intersect(5, 5, 0, 0, 0, 10, 10))

    def test_circle_touches_edge(self):
        self.assertTrue(point_box_intersect(12, 5, 2, 0, 0, 10, 10))

    def test_circle_outside_box(self):
        self.assertFalse(point_box_intersect(12, 5, 1, 0, 0, 10, 10))

    def test_circle_touches_corner(self):
        self.assertTrue(point_box_intersect(13, 14, 5, 0, 0, 10, 10))

    def test_circle_does_not_reach_corner(self):
        self.assertFalse(point_box_intersect(13, 14, 4, 0, 0, 10, 10))


if __name__ == "__main__":
    unittest.main()
