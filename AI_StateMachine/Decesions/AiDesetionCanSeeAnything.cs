using UnityEngine;

public class AiDesetionCanSeeAnything : SabiDecisionBase
{
    [SerializeField] private FieldOfView fieldOfView;

    public override bool GetResult()
    {
        return (fieldOfView.visibleTargets.Count > 0);
    }
}