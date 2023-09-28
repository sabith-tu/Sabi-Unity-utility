using UnityEngine;

public class AiDesetionCanHearDistraction : SabiDecisionBase
{
    [SerializeField] private AiSensorHearing aiSensorHearing;
    private Vector3 soundLocation;

    public override bool GetResult()
    {
        return Value;
    }
}