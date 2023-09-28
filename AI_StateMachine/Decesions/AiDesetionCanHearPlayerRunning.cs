using UnityEngine;

public class AiDesetionCanHearPlayerRunning : SabiDecisionBase
{
    [SerializeField] private AiSensorHearing aiSensorHearing;

    public override bool GetResult()
    {
        return Value;
    }
}