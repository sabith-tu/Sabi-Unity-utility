using UnityEditor;
using UnityEngine;

[InitializeOnLoad()]
public class WaypointEditor
{
    [DrawGizmo(GizmoType.Selected | GizmoType.NonSelected | GizmoType.Pickable)]
    public static void OnDrawScreenGizmos(SabiWaypoint waypoint, GizmoType gizmoType)
    {
        if ((gizmoType & GizmoType.Selected) != 0)
        {
            Gizmos.color = Color.green;
        }
        else
        {
            Gizmos.color = Color.gray;
        }

        Gizmos.DrawSphere(waypoint.transform.position, 0.1f);


        if (waypoint.nextWaypoint != null)
        {
            Gizmos.color = Color.cyan;
            Gizmos.DrawLine(waypoint.transform.position, waypoint.nextWaypoint.transform.position);
        }
    }
}